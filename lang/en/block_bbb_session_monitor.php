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

// Configuration strings
$string['config_webhook_url'] = 'Webhook URL';
$string['config_webhook_url_desc'] = 'URL where BigBlueButton will send webhook events';
$string['config_webhook_secret'] = 'Webhook Secret';
$string['config_webhook_secret_desc'] = 'Secret key for webhook signature verification';
$string['config_allowed_ips'] = 'Allowed IP Addresses';
$string['config_allowed_ips_desc'] = 'Comma-separated list of IP addresses allowed to send webhooks';
$string['config_data_retention'] = 'Data Retention (days)';
$string['config_data_retention_desc'] = 'Number of days to retain session data';
$string['config_polling_enabled'] = 'Enable Polling';
$string['config_polling_enabled_desc'] = 'Enable periodic polling of BBB API as fallback';
$string['config_polling_interval'] = 'Polling Interval (seconds)';
$string['config_polling_interval_desc'] = 'How often to poll BBB API when polling is enabled';
$string['config_email_alerts'] = 'Email Alerts';
$string['config_email_alerts_desc'] = 'Send email alerts for session events';
$string['config_alert_threshold'] = 'Alert Threshold';
$string['config_alert_threshold_desc'] = 'Participant count threshold for alerts';

// Interface strings
$string['active_sessions'] = 'Active Sessions';
$string['historical_log'] = 'Historical Log';
$string['statistics'] = 'Statistics';
$string['admin_config'] = 'Admin Configuration';
$string['session_name'] = 'Session Name';
$string['course_name'] = 'Course';
$string['lecturer_name'] = 'Lecturer';
$string['start_time'] = 'Start Time';
$string['end_time'] = 'End Time';
$string['duration'] = 'Duration';
$string['participants'] = 'Participants';
$string['peak_participants'] = 'Peak Participants';
$string['recording_status'] = 'Recording';
$string['join_session'] = 'Join Session';
$string['view_recording'] = 'View Recording';
$string['export_data'] = 'Export Data';
$string['refresh'] = 'Refresh';
$string['last_updated'] = 'Last Updated';
$string['no_active_sessions'] = 'No active sessions';
$string['no_historical_data'] = 'No historical data found';
$string['webhook_status'] = 'Webhook Status';
$string['webhook_operational'] = 'Webhook system operational';
$string['webhook_error'] = 'Webhook system error';
$string['total_sessions'] = 'Total Sessions';
$string['sessions_today'] = 'Sessions Today';
$string['average_duration'] = 'Average Duration';
$string['recordings_available'] = 'Recordings Available';

// Error messages
$string['error_no_permission'] = 'You do not have permission to view this content';
$string['error_session_not_found'] = 'Session not found';
$string['error_export_failed'] = 'Export failed';
$string['error_invalid_date_range'] = 'Invalid date range';
$string['error_webhook_config'] = 'Webhook configuration error';

// Success messages
$string['success_export_ready'] = 'Export file is ready for download';
$string['success_session_updated'] = 'Session data updated successfully';
$string['success_config_saved'] = 'Configuration saved successfully';

// Privacy
$string['privacy:metadata:block_bbb_sessions'] = 'Information about BBB sessions';
$string['privacy:metadata:block_bbb_sessions:meetingid'] = 'The BBB meeting ID';
$string['privacy:metadata:block_bbb_sessions:sessionname'] = 'The name of the session';
$string['privacy:metadata:block_bbb_sessions:moderatorname'] = 'The name of the session moderator';
$string['privacy:metadata:block_bbb_sessions:starttime'] = 'When the session started';
$string['privacy:metadata:block_bbb_sessions:endtime'] = 'When the session ended';

$string['privacy:metadata:block_bbb_participants'] = 'Information about session participants';
$string['privacy:metadata:block_bbb_participants:userid'] = 'The Moodle user ID of the participant';
$string['privacy:metadata:block_bbb_participants:participantname'] = 'The name of the participant';
$string['privacy:metadata:block_bbb_participants:jointime'] = 'When the participant joined';
$string['privacy:metadata:block_bbb_participants:leavetime'] = 'When the participant left';
