(function() {

  return {
    events: {
      'app.activated':'created',
      'listOrgUsers.done':'listOrgUsersDone',
      'updateTicket.done':'updateTicketDone',
      'click .initiate':'initiateVpn',
      'click .submit':'submitInternalComment',

    },

    requests: {
      listOrgUsers: function(id) {
        return {
          url: helpers.fmt('/api/v2/organizations/%@/users.json', id),
          type: 'GET'
        };
      },

      updateTicket: function(ticketData) {
        return {
          url: helpers.fmt('/api/v2/tickets/%@.json', ticketData.ticketId),
          type:'PUT',
          dataType:'json',
          data: {"ticket": {"comment":{ "body": ticketData.comment,"public":false} } },
          success: function(data) {console.log('yay!', data);},
          error:function(err){console.err(': (', err);}
        };
      }
    },

    created: function() {
      var orgId = this.ticket().organization().id();
      this.ajax('listOrgUsers', orgId);
    },

    listOrgUsersDone: function(data) {

      var users = {};
      var i = 0;
      users.names = {};
      data.users.forEach(function(user) {
        users.names[i] = user.name;
        i++;
      });

      this.switchTo('before', users);
    },

    initiateVpn: function() {
      var currentUser = this.$('.users :selected').text();
      var reason = this.$('.reason-before').val();
      var organizationName = this.ticket().organization().name();
      organizationName = organizationName.replace(/\s/g, "");
      var time = new Date();


      this.switchTo('after', {currentUser: currentUser, reason: reason, time:time, organizationName:organizationName});

    },

    submitInternalComment: function() {

      var ticketData = {};
      var currentUser = this.$('#current-user').text();
      var reason = this.$('#reason-after').text();
      var time_in = this.$('#time-in').text();
      var time_out = new Date();
      var action = this.$('.action').val();
      var vpnUrl = this.$('.vpn-url').text();


      ticketData.ticketId = this.ticket().id();

      ticketData.comment = 'User: ' + currentUser + '\n' + 'Reason: ' + reason + '\n' + 'Time-in: ' + time_in + '\n' + 'Time out: ' + time_out + '\n' + 'Action: ' + action + '\n' + 'URL: ' + vpnUrl;

      this.ajax('updateTicket', ticketData);
    },

    updateTicketDone:function(data) {
      this.created();
    }
  };

}());
