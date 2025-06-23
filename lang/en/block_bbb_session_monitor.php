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
 * Language strings for BBB Session Monitor block
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'BBB Session Monitor';
$string['bbb_session_monitor'] = 'BBB Session Monitor';
$string['bbb_session_monitor:addinstance'] = 'Add a new BBB Session Monitor block';
$string['bbb_session_monitor:view'] = 'View BBB Session Monitor';
$string['bbb_session_monitor:viewall'] = 'View all BBB sessions';
$string['bbb_session_monitor:export'] = 'Export BBB session data';
$string['bbb_session_monitor:configure'] = 'Configure BBB Session Monitor';

// Error messages
$string['error_loading_sessions'] = 'Unable to load session data. Please check if BigBlueButton module is installed and configured properly.';
$string['error_bbb_not_available'] = 'BigBlueButton module is not available or not properly configured.';
$string['error_no_permissions'] = 'You do not have permission to view this content.';

// Block content
$string['no_active_sessions'] = 'No active sessions found.';
$string['loading_sessions'] = 'Loading session data...';
$string['refresh_data'] = 'Refresh Data';
$string['view_all_sessions'] = 'View All Sessions';

// Configuration
$string['config_title'] = 'BBB Session Monitor Configuration';
$string['config_refresh_interval'] = 'Refresh Interval (seconds)';
$string['config_refresh_interval_desc'] = 'How often to refresh session data automatically';
$string['config_max_sessions_display'] = 'Maximum Sessions to Display';
$string['config_max_sessions_display_desc'] = 'Maximum number of active sessions to show in the block';
