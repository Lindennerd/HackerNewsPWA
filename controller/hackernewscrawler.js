var rp = require('request-promise');
var $  = require('cheerio');

function HackerNewsCrawler() {
    var url = 'https://news.ycombinator.com/';

    function getRequestUrl(pageName, page) {
        return url + pageName + '?p=' + (page ? page : 1);
    }
    
    function processHtmlPage(htmlPage) {
        return $('.athing', htmlPage).map(function(index, element) {
            return {
                title: $('.storylink', element).text(),
                url: $('.storylink', element).attr('href'),
                score: $('.score', element.nextSibling).text(),
                age: $('.age', element.nextSibling).text(),
                comments: {
                    text: $('a', element.nextSibling).last().text(),
                    link: $('a', element.nextSibling).last().attr('href')
                },
                sitebit: {
                    url: $('.sitebit > a', element).attr('href'),
                    site: $('.sitebit > a > span', element).text()
                }
            }
         
        }).get();
        
    }

    function getPage(pageName, page) {
        return new Promise(function(resolve, reject) {
            rp(getRequestUrl(pageName, page)).then(function(result) {
                resolve(processHtmlPage(result));
            }).catch(function(error) {
                reject(error);
            });
        });      
    }
    
    return {
        getPage: getPage
    }
}

module.exports = HackerNewsCrawler();