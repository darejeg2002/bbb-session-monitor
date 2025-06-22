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
 * Settings for BBB Session Monitor block
 *
 * @package    block_bbb_session_monitor
 * @copyright  2024 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

if ($ADMIN->fulltree) {
    
    // Webhook Configuration
    $settings->add(new admin_setting_heading(
        'block_bbb_session_monitor/webhook_heading',
        get_string('config_webhook_heading', 'block_bbb_session_monitor'),
        ''
    ));
    
    $settings->add(new admin_setting_configtext(
        'block_bbb_session_monitor/webhook_url',
        get_string('config_webhook_url', 'block_bbb_session_monitor'),
        get_string('config_webhook_url_desc', 'block_bbb_session_monitor'),
        $CFG->wwwroot . '/blocks/bbb_session_monitor/webhook.php',
        PARAM_URL
    ));
    
    $settings->add(new admin_setting_configpasswordunmask(
        'block_bbb_session_monitor/webhook_secret',
        get_string('config_webhook_secret', 'block_bbb_session_monitor'),
        get_string('config_webhook_secret_desc', 'block_bbb_session_monitor'),
        ''
    ));
    
    $settings->add(new admin_setting_configtextarea(
        'block_bbb_session_monitor/allowed_ips',
        get_string('config_allowed_ips', 'block_bbb_session_monitor'),
        get_string('config_allowed_ips_desc', 'block_bbb_session_monitor'),
        ''
    ));
    
    // Data Management
    $settings->add(new admin_setting_heading(
        'block_bbb_session_monitor/data_heading',
        get_string('config_data_heading', 'block_bbb_session_monitor'),
        ''
    ));
    
    $settings->add(new admin_setting_configtext(
        'block_bbb_session_monitor/data_retention',
        get_string('config_data_retention', 'block_bbb_session_monitor'),
        get_string('config_data_retention_desc', 'block_bbb_session_monitor'),
        150,
        PARAM_INT
    ));
    
    // Polling Configuration
    $settings->add(new admin_setting_heading(
        'block_bbb_session_monitor/polling_heading',
        get_string('config_polling_heading', 'block_bbb_session_monitor'),
        ''
    ));
    
    $settings->add(new admin_setting_configcheckbox(
        'block_bbb_session_monitor/polling_enabled',
        get_string('config_polling_enabled', 'block_bbb_session_monitor'),
        get_string('config_polling_enabled_desc', 'block_bbb_session_monitor'),
        1
    ));
    
    $settings->add(new admin_setting_configtext(
        'block_bbb_session_monitor/polling_interval',
        get_string('config_polling_interval', 'block_bbb_session_monitor'),
        get_string('config_polling_interval_desc', 'block_bbb_session_monitor'),
        60,
        PARAM_INT
    ));
    
    // Alert Configuration
    $settings->add(new admin_setting_heading(
        'block_bbb_session_monitor/alerts_heading',
        get_string('config_alerts_heading', 'block_bbb_session_monitor'),
        ''
    ));
    
    $settings->add(new admin_setting_configcheckbox(
        'block_bbb_session_monitor/email_alerts',
        get_string('config_email_alerts', 'block_bbb_session_monitor'),
        get_string('config_email_alerts_desc', 'block_bbb_session_monitor'),
        0
    ));
    
    $settings->add(new admin_setting_configtext(
        'block_bbb_session_monitor/alert_threshold',
        get_string('config_alert_threshold', 'block_bbb_session_monitor'),
        get_string('config_alert_threshold_desc', 'block_bbb_session_monitor'),
        50,
        PARAM_INT
    ));
}
