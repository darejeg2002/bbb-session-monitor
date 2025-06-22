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
 * Scheduled task to cleanup old session data
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_bbb_session_monitor\task;

defined('MOODLE_INTERNAL') || die();

class cleanup_old_data extends \core\task\scheduled_task {
    
    public function get_name() {
        return get_string('task_cleanup_old_data', 'block_bbb_session_monitor');
    }
    
    public function execute() {
        global $DB;
        
        $retention_days = get_config('block_bbb_session_monitor', 'data_retention') ?: 150;
        $cutoff_time = time() - ($retention_days * 24 * 60 * 60);
        
        // Clean up old sessions
        $old_sessions = $DB->get_records_select(
            'block_bbb_sessions',
            'timecreated < ?',
            [$cutoff_time],
            '',
            'id'
        );
        
        if (!empty($old_sessions)) {
            $session_ids = array_keys($old_sessions);
            
            // Delete participants first (foreign key constraint)
            list($in_sql, $params) = $DB->get_in_or_equal($session_ids);
            $DB->delete_records_select('block_bbb_participants', "sessionid $in_sql", $params);
            
            // Delete sessions
            $DB->delete_records_select('block_bbb_sessions', "id $in_sql", $params);
            
            mtrace('Cleaned up ' . count($old_sessions) . ' old sessions');
        }
        
        // Clean up old webhook events
        $webhook_retention = 30; // Keep webhook events for 30 days
        $webhook_cutoff = time() - ($webhook_retention * 24 * 60 * 60);
        
        $deleted_webhooks = $DB->delete_records_select(
            'block_bbb_webhook_events',
            'timecreated < ?',
            [$webhook_cutoff]
        );
        
        if ($deleted_webhooks) {
            mtrace('Cleaned up old webhook events');
        }
        
        mtrace('BBB Session Monitor cleanup completed');
    }
}
