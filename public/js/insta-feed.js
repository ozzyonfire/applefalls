function getInsta() {
    var feed = new Instafeed({
        get: 'user',
        clientId: 'dccb08c53d0a47bdb82a53546c05a2dc',
        userId: '4375800212',
        accessToken: '4375800212.dccb08c.c781221c063b41ac9e9d03d519d06614',
        resolution: 'standard_resolution',
        limit: 12,
        after: function() {
            //$('.square-img').css('object-fit', 'cover');
            $('.square-div').css('overflow', 'hidden');
        },
        template: '<div class="col-lg-2 col-md-2 col-sm-4 col-xs-6 square-div"><a href="{{link}}" target="_blank"><img src="{{image}}" class="img-responsive square-img" alt="" style="object-fit: cover; width: 280px; height: 280px;"></a></div>'
    });
    feed.run();
}

$( document ).ready(function() {
  getInsta();

});