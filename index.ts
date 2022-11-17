import * as fs from "fs";

interface IArticle {
  ID: string;
  name: string;
  slogan: string;
  net_price: number;
  sales_price: number;
  VAT: number;
  is_discount_applied: boolean;
}

interface IDiscount {
  ID: string;
  from_date: number;
  to_date: number;
  is_applied: Boolean;
  amount: number;
  articles: string[];
}

let article_one: IArticle = {
  ID: "1",
  name: "article_one",
  slogan: "slogan_one",
  net_price: 500,
  sales_price: 800,
  VAT: 0.8,
  is_discount_applied: false,
};
let article_two: IArticle = {
  ID: "2",
  name: "article_two",
  slogan: "slogan_two",
  net_price: 800,
  sales_price: 1200,
  VAT: 0.8,
  is_discount_applied: false,
};
let article_three: IArticle = {
  ID: "3",
  name: "article_three",
  slogan: "slogan_three",
  net_price: 900,
  sales_price: 1200,
  VAT: 0.8,
  is_discount_applied: false,
};

let discount: IDiscount = {
  ID: "1",
  from_date: new Date("March 15 2021").getTime(),
  to_date: Date.now(),
  is_applied: false,
  amount: 0.1,
  articles: ["1", "2"],
};
let discount_two: IDiscount = {
  ID: "2",
  from_date: new Date("March 14 2021").getTime(),
  to_date: new Date("March 14 2021").getTime(),
  is_applied: false,
  amount: 0.2,
  articles: ["3"],
};


let content = [article_one, article_two, article_three];
let discounts = [discount,discount_two]
storeArticles(content);
storeDiscounts(discounts)
// store articles
function storeArticles(content: IArticle[]) {
  fs.writeFile("articles.json", JSON.stringify(content), (error) => {
    if (error) console.log(error);
  });
}

function storeDiscounts(content: IDiscount[]) {
  fs.writeFile("discounts.json", JSON.stringify(content), (error) => {
    if (error) console.log(error);
  });
}

function getAllDiscounts(): IDiscount[] {
  return discounts;
}

function getArticles(): IArticle[] {return content}
function getArticle(articleID: string): IArticle {
  let articles: IArticle[] = getArticles();
  return articles.filter((article) => article.ID === articleID)[0];
}

// input: a specific Date
// output: the price of each article on that date
function articleOnDate(date: string | number): IArticle[] {
  // query all discount whose date is within the date
  if (typeof date == "string") date = new Date(date).getTime();
  const discounts: IDiscount[] = getAllDiscounts();
  const filterDiscounts: IDiscount[] = discounts.filter(
    (discount: IDiscount) =>
      date >= discount.from_date && date <= discount.to_date
  );
  const result: IArticle[] = [];
  filterDiscounts.forEach((discount: IDiscount) => {
    const articles = discount.articles; // get an array of article_id
    articles.forEach((article) => {
      const art = getArticle(article);
      let discountedPrice = art.sales_price - art.sales_price * discount.amount;
      // apply discount to the article if the article has not been discounted
      if (!art.is_discount_applied) {
        // the discounted price must be at least the net price of the article
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

console.log(articleOnDate("March 15 2021"));
