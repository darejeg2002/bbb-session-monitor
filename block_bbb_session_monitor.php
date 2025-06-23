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
 * Main block class for BBB Session Monitor
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_bbb_session_monitor extends block_base {

    public function init() {
        $this->title = get_string('pluginname', 'block_bbb_session_monitor');
    }

    public function get_content() {
        global $CFG, $USER, $PAGE;

        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = new stdClass();
        $this->content->text = '';
        $this->content->footer = '';

        // Check if user has capability to view the block
        $context = context_system::instance();
        if (!has_capability('block/bbb_session_monitor:view', $context)) {
            return $this->content;
        }

        // Add CSS and JS
        $PAGE->requires->css('/blocks/bbb_session_monitor/styles.css');
        
        // Get session data
        try {
            $session_manager = new \block_bbb_session_monitor\session_manager();
            $active_sessions = $session_manager->get_active_sessions();
            $user_role = $this->get_user_role();

            // Filter sessions based on user role
            if ($user_role !== 'admin') {
                $active_sessions = $this->filter_sessions_by_user($active_sessions);
            }

            // Build the content
            $this->content->text = $this->build_dashboard_content($active_sessions);
            
        } catch (Exception $e) {
            // Handle gracefully if session manager fails
            debugging('Error loading session manager: ' . $e->getMessage());
            $this->content->text = '<div class="alert alert-warning">' . 
                                   get_string('error_loading_sessions', 'block_bbb_session_monitor') . 
                                   '</div>';
        }

        return $this->content;
    }

    public function applicable_formats() {
        return array(
            'site-index' => true,
            'course-view' => true,
            'my' => true
        );
    }

    public function has_config() {
        return true;
    }

    public function instance_allow_multiple() {
        return false;
    }

    private function get_user_role() {
        global $USER;
        
        $context = context_system::instance();
        if (has_capability('moodle/site:config', $context)) {
            return 'admin';
        }
        
        if (has_capability('moodle/course:manageactivities', $context)) {
            return 'manager';
        }
        
        return 'user';
    }

    private function filter_sessions_by_user($sessions) {
        global $USER;
        
        // Get courses where user has management capabilities
        $managed_courses = get_user_capability_course('moodle/course:manageactivities', $USER->id);
        $course_ids = array_keys($managed_courses);
        
        return array_filter($sessions, function($session) use ($course_ids) {
            return in_array($session->courseid, $course_ids);
        });
    }

    private function build_dashboard_content($sessions) {
        global $CFG;
        
        $html = '<div id="bbb-session-monitor-root"></div>';
        $html .= '<script>
            window.BBB_MONITOR_CONFIG = {
                wwwroot: "' . $CFG->wwwroot . '",
                sesskey: "' . sesskey() . '",
                activeSessions: ' . json_encode($sessions) . '
            };
        </script>';
        $html .= '<script src="' . $CFG->wwwroot . '/blocks/bbb_session_monitor/dist/assets/index.js"></script>';
        
        return $html;
    }
}
