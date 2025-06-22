<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Session manager class for BBB Session Monitor
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_bbb_session_monitor;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/mod/bigbluebuttonbn/classes/local/bigbluebutton.php');

class session_manager {
    
    /**
     * Get all active BBB sessions
     *
     * @return array Array of session objects
     */
    public function get_active_sessions() {
        global $DB;
        
        $sql = "SELECT s.*, c.fullname as coursename, b.name as activityname
                FROM {block_bbb_sessions} s
                JOIN {course} c ON s.courseid = c.id
                JOIN {bigbluebuttonbn} b ON s.instanceid = b.id
                WHERE s.status = 'active'
                ORDER BY s.starttime DESC";
        
        $sessions = $DB->get_records_sql($sql);
        
        // Enrich with participant data
        foreach ($sessions as $session) {
            $session->participants = $this->get_session_participants($session->id);
        }
        
        return array_values($sessions);
    }
    
    /**
     * Get historical sessions with optional filters
     *
     * @param array $filters Optional filters
     * @return array Array of session objects
     */
    public function get_historical_sessions($filters = []) {
        global $DB;
        
        $where_conditions = ['s.status = ?'];
        $params = ['ended'];
        
        // Apply date filters
        if (!empty($filters['date_from'])) {
            $where_conditions[] = 's.starttime >= ?';
            $params[] = strtotime($filters['date_from']);
        }
        
        if (!empty($filters['date_to'])) {
            $where_conditions[] = 's.starttime <= ?';
            $params[] = strtotime($filters['date_to'] . ' 23:59:59');
        }
        
        // Apply course filter
        if (!empty($filters['course'])) {
            $where_conditions[] = 's.courseid = ?';
            $params[] = $filters['course'];
        }
        
        // Apply lecturer filter
        if (!empty($filters['lecturer'])) {
            $where_conditions[] = 's.moderatorname LIKE ?';
            $params[] = '%' . $filters['lecturer'] . '%';
        }
        
        // Apply recording status filter
        if (!empty($filters['recording_status'])) {
            $where_conditions[] = 's.recordingstatus = ?';
            $params[] = $filters['recording_status'];
        }
        
        $where_clause = implode(' AND ', $where_conditions);
        
        $sql = "SELECT s.*, c.fullname as coursename, b.name as activityname
                FROM {block_bbb_sessions} s
                JOIN {course} c ON s.courseid = c.id
                JOIN {bigbluebuttonbn} b ON s.instanceid = b.id
                WHERE {$where_clause}
                ORDER BY s.starttime DESC";
        
        return array_values($DB->get_records_sql($sql, $params));
    }
    
    /**
     * Get participants for a specific session
     *
     * @param int $session_id Session ID
     * @return array Array of participant objects
     */
    public function get_session_participants($session_id) {
        global $DB;
        
        $sql = "SELECT p.*, u.firstname, u.lastname, u.email
                FROM {block_bbb_participants} p
                LEFT JOIN {user} u ON p.userid = u.id
                WHERE p.sessionid = ?
                ORDER BY p.jointime ASC";
        
        return array_values($DB->get_records_sql($sql, [$session_id]));
    }
    
    /**
     * Update session from BBB API
     *
     * @param string $meeting_id BBB meeting ID
     * @return bool Success status
     */
    public function update_session_from_api($meeting_id) {
        global $DB;
        
        try {
            // Get meeting info from BBB API
            $meeting_info = $this->get_meeting_info_from_bbb($meeting_id);
            
            if (!$meeting_info) {
                return false;
            }
            
            // Update or create session record
            $session = $DB->get_record('block_bbb_sessions', ['meetingid' => $meeting_id]);
            
            if ($session) {
                $this->update_existing_session($session, $meeting_info);
            } else {
                $this->create_new_session($meeting_id, $meeting_info);
            }
            
            return true;
            
        } catch (\Exception $e) {
            debugging('Error updating session from API: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Process webhook event
     *
     * @param string $event_type Event type
     * @param array $event_data Event data
     * @return bool Success status
     */
    public function process_webhook_event($event_type, $event_data) {
        global $DB;
        
        // Store webhook event
        $webhook_record = new \stdClass();
        $webhook_record->eventtype = $event_type;
        $webhook_record->meetingid = $event_data['meeting_id'] ?? '';
        $webhook_record->eventdata = json_encode($event_data);
        $webhook_record->processed = 0;
        $webhook_record->timecreated = time();
        
        $event_id = $DB->insert_record('block_bbb_webhook_events', $webhook_record);
        
        // Process the event
        try {
            switch ($event_type) {
                case 'meeting-created':
                    $this->handle_meeting_created($event_data);
                    break;
                case 'meeting-ended':
                    $this->handle_meeting_ended($event_data);
                    break;
                case 'user-joined':
                    $this->handle_user_joined($event_data);
                    break;
                case 'user-left':
                    $this->handle_user_left($event_data);
                    break;
                case 'recording-ready':
                    $this->handle_recording_ready($event_data);
                    break;
            }
            
            // Mark as processed
            $DB->set_field('block_bbb_webhook_events', 'processed', 1, ['id' => $event_id]);
            $DB->set_field('block_bbb_webhook_events', 'processedat', time(), ['id' => $event_id]);
            
            return true;
            
        } catch (\Exception $e) {
            debugging('Error processing webhook event: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get session statistics
     *
     * @param array $filters Optional filters
     * @return array Statistics data
     */
    public function get_session_statistics($filters = []) {
        global $DB;
        
        $stats = [];
        
        // Total sessions
        $stats['total_sessions'] = $DB->count_records('block_bbb_sessions');
        
        // Active sessions
        $stats['active_sessions'] = $DB->count_records('block_bbb_sessions', ['status' => 'active']);
        
        // Sessions today
        $today_start = strtotime('today');
        $today_end = strtotime('tomorrow') - 1;
        $stats['sessions_today'] = $DB->count_records_select(
            'block_bbb_sessions',
            'starttime BETWEEN ? AND ?',
            [$today_start, $today_end]
        );
        
        // Average duration
        $avg_duration = $DB->get_field_sql(
            'SELECT AVG(duration) FROM {block_bbb_sessions} WHERE duration IS NOT NULL AND duration > 0'
        );
        $stats['average_duration'] = round($avg_duration ?? 0);
        
        // Peak participants
        $stats['peak_participants'] = $DB->get_field_sql(
            'SELECT MAX(peakparticipants) FROM {block_bbb_sessions}'
        ) ?? 0;
        
        // Recordings available
        $stats['recordings_available'] = $DB->count_records('block_bbb_sessions', ['recordingstatus' => 'available']);
        
        // Sessions by day (last 7 days)
        $stats['sessions_by_day'] = $this->get_sessions_by_day(7);
        
        // Participants by hour (last 24 hours)
        $stats['participants_by_hour'] = $this->get_participants_by_hour(24);
        
        return $stats;
    }
    
    /**
     * Export session data
     *
     * @param array $filters Export filters
     * @param string $format Export format (csv, xlsx)
     * @return string File path or false on error
     */
    public function export_session_data($filters, $format = 'csv') {
        global $CFG;
        
        $sessions = $this->get_historical_sessions($filters);
        
        if (empty($sessions)) {
            return false;
        }
        
        $filename = 'bbb_sessions_' . date('Y-m-d_H-i-s') . '.' . $format;
        $filepath = $CFG->tempdir . '/' . $filename;
        
        if ($format === 'csv') {
            return $this->export_to_csv($sessions, $filepath);
        } else if ($format === 'xlsx') {
            return $this->export_to_xlsx($sessions, $filepath);
        }
        
        return false;
    }
    
    // Private helper methods
    
    private function get_meeting_info_from_bbb($meeting_id) {
        // Implementation would use BBB API to get meeting info
        // This is a placeholder - actual implementation would use mod_bigbluebuttonbn classes
        return null;
    }
    
    private function update_existing_session($session, $meeting_info) {
        global $DB;
        
        $session->currentparticipants = $meeting_info['participant_count'] ?? 0;
        $session->peakparticipants = max($session->peakparticipants, $session->currentparticipants);
        $session->timemodified = time();
        
        $DB->update_record('block_bbb_sessions', $session);
    }
    
    private function create_new_session($meeting_id, $meeting_info) {
        global $DB;
        
        // Implementation would create new session record
        // This requires mapping BBB meeting to Moodle course/activity
    }
    
    private function handle_meeting_created($event_data) {
        // Handle meeting created webhook
    }
    
    private function handle_meeting_ended($event_data) {
        // Handle meeting ended webhook
    }
    
    private function handle_user_joined($event_data) {
        // Handle user joined webhook
    }
    
    private function handle_user_left($event_data) {
        // Handle user left webhook
    }
    
    private function handle_recording_ready($event_data) {
        // Handle recording ready webhook
    }
    
    private function get_sessions_by_day($days) {
        global $DB;
        
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-{$i} days"));
            $start = strtotime($date);
            $end = strtotime($date . ' 23:59:59');
            
            $count = $DB->count_records_select(
                'block_bbb_sessions',
                'starttime BETWEEN ? AND ?',
                [$start, $end]
            );
            
            $data[] = [
                'date' => $date,
                'sessions' => $count
            ];
        }
        
        return $data;
    }
    
    private function get_participants_by_hour($hours) {
        global $DB;
        
        $data = [];
        for ($i = $hours - 1; $i >= 0; $i--) {
            $hour_start = strtotime("-{$i} hours", strtotime(date('Y-m-d H:00:00')));
            $hour_end = $hour_start + 3599;
            
            $participants = $DB->get_field_sql(
                'SELECT SUM(peakparticipants) FROM {block_bbb_sessions} 
                 WHERE starttime BETWEEN ? AND ?',
                [$hour_start, $hour_end]
            ) ?? 0;
            
            $data[] = [
                'hour' => date('H:00', $hour_start),
                'participants' => $participants
            ];
        }
        
        return $data;
    }
    
    private function export_to_csv($sessions, $filepath) {
        $file = fopen($filepath, 'w');
        
        // CSV headers
        $headers = [
            'Session Name', 'Course', 'Lecturer', 'Start Time', 'End Time',
            'Duration (min)', 'Peak Participants', 'Recording Status', 'Recording URL'
        ];
        fputcsv($file, $headers);
        
        // Data rows
        foreach ($sessions as $session) {
            $row = [
                $session->sessionname,
                $session->coursename,
                $session->moderatorname,
                date('Y-m-d H:i:s', $session->starttime),
                $session->endtime ? date('Y-m-d H:i:s', $session->endtime) : '',
                $session->duration ?? '',
                $session->peakparticipants,
                $session->recordingstatus,
                $session->recordingurl ?? ''
            ];
            fputcsv($file, $row);
        }
        
        fclose($file);
        return $filepath;
    }
    
    private function export_to_xlsx($sessions, $filepath) {
        // XLSX export would require additional library like PhpSpreadsheet
        // For now, fallback to CSV
        return $this->export_to_csv($sessions, str_replace('.xlsx', '.csv', $filepath));
    }
}
