(function() {

  return {
    events: {
      'app.activated':'created',
      'listOrgUsers.done':'listOrgUsersDone',
      'click .initiate':'initiateVpn'
    },

    requests: {
      listOrgUsers: function(id) {
        return {
          url: helpers.fmt('/api/v2/organizations/%@/users.json', id),
          type: 'GET'
        }
      }
    },

    created: function() {
      var orgId = this.ticket().organization().id()
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

      this.switchTo('before', users)
    },

    initiateVpn: function() {
      var currentUser = this.$('.users :selected').text();
      var reason = this.$('.reason').val();
      var organizationName = this.ticket().organization().name();
      organizationName = organizationName.replace(/\s/g, "");
      var time = new Date();


      this.switchTo('after', {currentUser: currentUser, reason: reason, time:time, organizationName:organizationName})
    }
  };

}());
