
var $newsSource = $('#source');
var $searchSection = $('#search');
var $mainSection = $('#main')

var $popUp = $('#popUp');
var $closePopUp = $('.closePopUp');
var mashApi = 'http://feedr-api.wdidc.org/mashable.json'
var redditApi = 'https://www.reddit.com/top.json'
var diggApi = 'http://feedr-api.wdidc.org/digg.json'


function newArticle(articleObj) {
  this.image = articleObj.image
  this.title = articleObj.title;
  this.category = articleObj.category;
  this.impressions = articleObj.impressions;
  this.link = articleObj.link;
  this.description = articleObj.description;

}


function addArticle(article){
    var mainDisplay =
        '<article class="article">' +
            '<section class="featuredImage">' +
                '<img src='+article.image+' alt="" />' +
            '</section>' +
            '<section class="articleContent">' +
                '<a href="'+article.link+'"><h3>'+article.title+'</h3></a>' +
        '       <p class = "description">'+article.description+'</p>'+
                '<h6>'+article.category+'</h6>' +
            '</section>' +
            '<section class="impressions">'+article.impressions+'</section>' +
        '<div class="clearfix"></div>' +
        '</article>';

    $mainSection.append(mainDisplay);
}

function concatTags(tags){
    var tagString = '';
    count = 0;
    while(count<tags.length){
        tagString += tags[count].display
        if(count!=tags.length-1){
            tagString += ', '
        }
        count++;
    }
    return tagString;
}

function displayPopUp(article){
        var $title= article.html();
        var $link= article.parent().attr("href");
        var $article = article.closest('article');
        var $desc=$article.find('.description').html()

        $popUp.find('h1').html($title);
        $popUp.find('p').html($desc);
        $popUp.find('a').attr("href", $link);
        $popUp.removeClass('loader hidden');
}
$closePopUp.on('click', function(e) {
    e.preventDefault();
    $popUp.addClass("loader hidden")

})

$(function(){

  $('nav ul ul a').on("click", function(e) {
      e.preventDefault();
      $popUp.removeClass('hidden');
      $mainSection.html('');
      $source = $(this).html();
      $newsSource.html($source);

      if($newsSource.html() === 'Mashable'){

        $.get(mashApi,function(response){
            $popUp.addClass('hidden')
            var articles = response.hot;
            for(var i =0; i<articles.length; i++ ){
                var curr = articles[i];
                var article = new newArticle(
                    {
                        image: curr.feature_image,
                        title: curr.title,
                        category: curr.channel,
                        impressions: curr.shares.total,
                        link: curr.link,
                        description: curr.content.plain
                    });
                addArticle(article);
            }

             $(".article .articleContent h3").on('click',function(e){
                e.preventDefault();
                displayPopUp($(this));

            })

        });

      }
      else if($newsSource.html() === 'Reddit'){
          $.get(redditApi,function(response) {
              $popUp.addClass('hidden')
              console.log(response);
              var articles = response.data.children;
              for (var i = 0; i < articles.length; i++) {
                  var curr = articles[i].data;
                  var article = new newArticle(
                      {
                          image: curr.thumbnail,
                          title: curr.title,
                          category: curr.subreddit,
                          impressions: curr.ups,
                          link: curr.url,
                          description: 'No description available'
                      }
                  );
                  addArticle(article);

              }
          });
      }
      else{
          $.get(diggApi, function(response){
              $popUp.addClass('hidden')
              console.log(response);
              var articles = response.data.feed;
              for (var i = 0; i < articles.length; i++) {
                  var curr = articles[i];
                  var article = new newArticle(
                      {
                          image: curr.content.media.images[0].url,
                          title: curr.content.title,
                          category: concatTags(curr.content.tags),
                          impressions: curr.digg_score,
                          link: curr.content.url,
                          description: curr.content.description
                      }
                  );
                  addArticle(article);

              }
          })
      }

  });

})


