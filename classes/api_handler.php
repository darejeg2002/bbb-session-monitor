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
 * API handler for AJAX requests
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_bbb_session_monitor;

defined('MOODLE_INTERNAL') || die();

class api_handler {
    
    /**
     * Handle AJAX requests
     *
     * @param string $action Action to perform
     * @param array $params Request parameters
     * @return array Response data
     */
    public static function handle_request($action, $params = []) {
        global $USER;
        
        // Verify session and capabilities
        require_sesskey();
        
        $context = \context_system::instance();
        if (!has_capability('block/bbb_session_monitor:view', $context)) {
            return ['error' => 'Access denied'];
        }
        
        $session_manager = new session_manager();
        
        switch ($action) {
            case 'get_active_sessions':
                return self::get_active_sessions($session_manager);
                
            case 'get_historical_sessions':
                return self::get_historical_sessions($session_manager, $params);
                
            case 'get_session_details':
                return self::get_session_details($session_manager, $params);
                
            case 'get_statistics':
                return self::get_statistics($session_manager, $params);
                
            case 'export_data':
                return self::export_data($session_manager, $params);
                
            case 'refresh_session':
                return self::refresh_session($session_manager, $params);
                
            default:
                return ['error' => 'Invalid action'];
        }
    }
    
    private static function get_active_sessions($session_manager) {
        try {
            $sessions = $session_manager->get_active_sessions();
            return [
                'success' => true,
                'data' => $sessions,
                'timestamp' => time()
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to fetch active sessions'];
        }
    }
    
    private static function get_historical_sessions($session_manager, $params) {
        try {
            $filters = [
                'date_from' => $params['date_from'] ?? '',
                'date_to' => $params['date_to'] ?? '',
                'course' => $params['course'] ?? '',
                'lecturer' => $params['lecturer'] ?? '',
                'recording_status' => $params['recording_status'] ?? ''
            ];
            
            $sessions = $session_manager->get_historical_sessions($filters);
            
            return [
                'success' => true,
                'data' => $sessions,
                'total' => count($sessions)
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to fetch historical sessions'];
        }
    }
    
    private static function get_session_details($session_manager, $params) {
        try {
            $session_id = $params['session_id'] ?? 0;
            if (!$session_id) {
                return ['error' => 'Session ID required'];
            }
            
            $participants = $session_manager->get_session_participants($session_id);
            
            return [
                'success' => true,
                'data' => $participants
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to fetch session details'];
        }
    }
    
    private static function get_statistics($session_manager, $params) {
        try {
            $filters = $params['filters'] ?? [];
            $stats = $session_manager->get_session_statistics($filters);
            
            return [
                'success' => true,
                'data' => $stats
            ];
        } catch (\Exception $e) {
            return ['error' => 'Failed to fetch statistics'];
        }
    }
    
    private static function export_data($session_manager, $params) {
        global $CFG;
        
        try {
            // Check export capability
            $context = \context_system::instance();
            if (!has_capability('block/bbb_session_monitor:export', $context)) {
                return ['error' => 'Export permission denied'];
            }
            
            $filters = $params['filters'] ?? [];
            $format = $params['format'] ?? 'csv';
            
            $filepath = $session_manager->export_session_data($filters, $format);
            
            if ($filepath) {
                $filename = basename($filepath);
                $download_url = $CFG->wwwroot . '/blocks/bbb_session_monitor/download.php?file=' . urlencode($filename);
                
                return [
                    'success' => true,
                    'download_url' => $download_url,
                    'filename' => $filename
                ];
            } else {
                return ['error' => 'Export failed - no data found'];
            }
        } catch (\Exception $e) {
            return ['error' => 'Export failed'];
        }
    }
    
    private static function refresh_session($session_manager, $params) {
        try {
            $meeting_id = $params['meeting_id'] ?? '';
            if (!$meeting_id) {
                return ['error' => 'Meeting ID required'];
            }
            
            $success = $session_manager->update_session_from_api($meeting_id);
            
            return [
                'success' => $success,
                'message' => $success ? 'Session refreshed' : 'Refresh failed'
            ];
        } catch (\Exception $e) {
            return ['error' => 'Refresh failed'];
        }
    }
}
