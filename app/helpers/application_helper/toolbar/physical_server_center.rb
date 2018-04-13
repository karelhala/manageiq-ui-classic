class ApplicationHelper::Toolbar::PhysicalServerCenter < ApplicationHelper::Toolbar::Basic
  button_group(
    'physical_server_vmdb',
    [
      select(
        :physical_server_vmdb_choice,
        'fa fa-cog fa-lg',
        t = N_('Configuration'),
        t,
        :items => [
          button(
            :physical_server_refresh,
            'fa fa-refresh fa-lg',
            N_('Refresh relationships and power states for all items related to the selected Physical Servers'),
            N_('Refresh Relationships and Power States'),
            :image   => "refresh",
            :data    => {'function'      => 'ManageIQ.redux.store.dispatch',
                         'function-data' => '{"type": "refresh", "payload": {"entity": "physical_servers"}}'},
            :confirm => N_("Refresh relationships and power states for all items related to the selected Physical Servers?"),
            :options => {:feature => :refresh}
          ),
        ]
      ),
    ]
  )
  button_group(
    'physical_server_operations',
    [
      select(
        :physical_server_power_choice,
        'fa fa-power-off fa-lg',
        N_('Power Functions'),
        N_('Power'),
        :items => [
          button(
            :physical_server_power_on,
            nil,
            N_('Power on the server'),
            N_('Power On'),
            :image                       => "power_on",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "power_on", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Power on the server?"),
            :options                     => {:feature => :power_on}
          ),
          button(
            :physical_server_power_off,
            nil,
            N_('Power off the server'),
            N_('Power Off'),
            :image                       => "power_off",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "power_off", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Power off the server?"),
            :options                     => {:feature => :power_off}
          ),
          button(
            :physical_server_power_off_now,
            nil,
            N_('Power off the server immediately'),
            N_('Power Off Immediately'),
            :image   => "power_off",
            :data    => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "power_off_now", "controller": "physicalServerToolbarController"}'},
            :confirm => N_("Power off the server immediately?"),
            :options => {:feature => :power_off_now}
          ),
          button(
            :physical_server_restart,
            nil,
            N_('Restart the server'),
            N_('Restart'),
            :image                       => "power_reset",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "restart", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Restart the server?"),
            :options                     => {:feature => :restart}
          ),
          button(
            :physical_server_restart_now,
            nil,
            N_('Restart Server Immediately'),
            N_('Restart Immediately'),
            :image   => "power_reset",
            :data    => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "restart_now", "controller": "physicalServerToolbarController"}'},
            :confirm => N_("Restart the server immediately?"),
            :options => {:feature => :restart_now}
          ),
          button(
            :physical_server_restart_to_sys_setup,
            nil,
            N_('Restart Server to System Setup'),
            N_('Restart to System Setup'),
            :image   => "power_reset",
            :data    => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "restart_to_sys_setup", "controller": "physicalServerToolbarController"}'},
            :confirm => N_("Restart the server to UEFI settings?"),
            :options => {:feature => :restart_to_sys_setup}
          ),
          button(
            :physical_server_restart_mgmt_controller,
            nil,
            N_('Restart Management Controller'),
            N_('Restart Management Controller'),
            :image   => "power_reset",
            :data    => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "restart_mgmt_controller", "controller": "physicalServerToolbarController"}'},
            :confirm => N_("Restart management controller?"),
            :options => {:feature => :restart_mgmt_controller}
          )
        ]
      ),
      select(
        :physical_server_identify_choice,
        nil,
        N_('Identify LED Operations'),
        N_('Identify'),
        :items => [
          button(
            :physical_server_blink_loc_led,
            nil,
            N_('Blink the Identify LED'),
            N_('Blink LED'),
            :image                       => "blank_button",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "blink_loc_led", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Blink the Identify LED?"),
            :options                     => {:feature => :blink_loc_led}
          ),
          button(
            :physical_server_turn_on_loc_led,
            nil,
            N_('Turn on the Idenfity LED'),
            N_('Turn On LED'),
            :image                       => "blank_button",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "turn_on_loc_led", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Turn on the Identify LED?"),
            :options                     => {:feature => :turn_on_loc_led}
          ),
          button(
            :physical_server_turn_off_loc_led,
            nil,
            N_('Turn off the Identify LED'),
            N_('Turn Off LED'),
            :image                       => "blank_button",
            :data                        => {'function'      => 'sendDataWithRx',
                         'function-data' => '{"type": "turn_off_loc_led", "controller": "physicalServerToolbarController"}'},
            :confirm                     => N_("Turn off the Identify LED?"),
            :options                     => {:feature => :turn_off_loc_led}
          ),
        ]
      ),
    ]
  )
  button_group(
    'physical_server_policy',
    [
      select(
        :physical_server_policy_choice,
        'fa fa-shield fa-lg',
        N_('Policy'),
        :enabled => true,
        :onwhen  => "1+",
        :items   => [
          button(
            :physical_server_protect,
            'pficon pficon-edit fa-lg',
            N_('Manage Policies for the selected items'),
            N_('Manage Policies'),
            :url_parms    => "main_div",
            :send_checked => true,
            :enabled      => true,
            :onwhen       => "1+"
          ),
          button(
            :physical_server_tag,
            'pficon pficon-edit fa-lg',
            N_('Edit tags for the selected items'),
            N_('Edit Tags'),
            :url_parms    => "main_div",
            :send_checked => true,
            :enabled      => true,
            :onwhen       => "1+"
          ),
        ]
      ),
      select(
        :physical_server_lifecycle_choice,
        'fa fa-recycle fa-lg',
        t = N_('Lifecycle'),
        t,
        :enabled => true,
        :items   => [
          button(
            :physical_server_provision,
            'pficon pficon-add-circle-o fa-lg',
            t = N_('Provision Physical Server'),
            t,
            :url       => "provision",
            :url_parms => "main_div",
            :enabled   => true,
            :onwhen    => "0+",
            :klass     => ApplicationHelper::Button::ConfiguredSystemProvision
          )
        ]
      )
    ]
  )

  button_group(
    'physical_server_monitoring',
    [
      select(
        :physical_server_monitoring_choice,
        'ff ff-monitoring fa-lg',
        t = N_('Monitoring'),
        t,
        :items => [
          button(
            :physical_server_timeline,
            'ff ff-timeline fa-lg',
            N_('Show Timelines for this Physical Server'),
            N_('Timelines'),
            :klass     => ApplicationHelper::Button::PhysicalServerTimeline,
            :url_parms => "?display=timeline"
          )
        ]
      )
    ]
  )
end
