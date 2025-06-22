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
 * Scheduled task to sync BBB sessions
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_bbb_session_monitor\task;

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/blocks/bbb_session_monitor/classes/session_manager.php');

class sync_sessions extends \core\task\scheduled_task {
    
    public function get_name() {
        return get_string('task_sync_sessions', 'block_bbb_session_monitor');
    }
    
    public function execute() {
        global $DB;
        
        // Only run if polling is enabled
        $polling_enabled = get_config('block_bbb_session_monitor', 'polling_enabled');
        if (!$polling_enabled) {
            mtrace('Polling disabled, skipping sync');
            return;
        }
        
        $session_manager = new \block_bbb_session_monitor\session_manager();
        
        // Get all active sessions that need updating
        $active_sessions = $DB->get_records('block_bbb_sessions', ['status' => 'active']);
        
        $updated_count = 0;
        $ended_count = 0;
        
        foreach ($active_sessions as $session) {
            try {
                $success = $session_manager->update_session_from_api($session->meetingid);
                if ($success) {
                    $updated_count++;
                    
                    // Check if session ended
                    $updated_session = $DB->get_record('block_bbb_sessions', ['id' => $session->id]);
                    if ($updated_session && $updated_session->status === 'ended') {
                        $ended_count++;
                    }
                }
            } catch (\Exception $e) {
                mtrace('Error updating session ' . $session->meetingid . ': ' . $e->getMessage());
            }
        }
        
        mtrace("BBB Session sync completed: {$updated_count} sessions updated, {$ended_count} sessions ended");
    }
}
