"use strict";
exports.__esModule = true;
var fs = require("fs");
var article_one = {
    ID: "1",
    name: "article_one",
    slogan: "slogan_one",
    net_price: 500,
    sales_price: 800,
    VAT: 0.8,
    is_discount_applied: false
};
var article_two = {
    ID: "2",
    name: "article_two",
    slogan: "slogan_two",
    net_price: 800,
    sales_price: 1200,
    VAT: 0.8,
    is_discount_applied: false
};
var discount = {
    ID: "1",
    from_date: Date.now(),
    to_date: Date.now(),
    is_applied: false,
    amount: 0.1,
    articles: ["1", "2"]
};
var content = [article_one, article_two];
var discounts = [discount];
storeArticles(content);
// store articles
function storeArticles(content) {
    fs.writeFile("articles.json", JSON.stringify(content), function (error) {
        if (error)
            console.log(error);
    });
}
function storeDiscounts(content) {
    fs.writeFile("discounts.json", JSON.stringify(content), function (error) {
        if (error)
            console.log(error);
    });
}
function getAllDiscounts() {
    return discounts;
}
function getArticle(articleID) {
    var articles = [article_one, article_two];
    return articles.filter(function (article) { return article.ID === articleID; })[0];
}
// input: a specific Date
// output: the price of each article on that date
function articleOnDate(date) {
    // query all discount whose date is within the date
    if (typeof date == "string")
        date = new Date(date).getTime();
    var discounts = getAllDiscounts();
    var filterDiscounts = discounts.filter(function (discount) {
        return date >= discount.from_date && date <= discount.to_date;
    });
    var result = [];
    filterDiscounts.forEach(function (discount) {
        var articles = discount.articles; // get an array of article_id
        articles.forEach(function (article) {
            var art = getArticle(article);
            var discountedPrice = art.sales_price - art.sales_price * discount.amount;
            if (!art.is_discount_applied) {
                console.log(discountedPrice);
                if (discountedPrice >= art.net_price) {
                    art.sales_price = discountedPrice;
                    art.is_discount_applied = true;
                    result.push(art);
                }
            }
        });
    });
    return result;
}
console.log(articleOnDate(Date.now()));
