class apiFeatures{

    // query is the product htat we want to search from product schema and 
    // queryStr is the query that we are searching in our product schema..

    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    // creating search functionality by using mongodb functions like
    // $regex = Provides regular expression capabilities for pattern matching strings in queries.
    //  MongoDB uses Perl compatible regular expressions (i.e. "PCRE" ) version 8.42 with UTF-8 support.

    search(){
        
        const keyword = this.queryStr.keyword 
        ?  {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
    // i means the searching should be in case insensitive that is if the searcher search ABC result should be ABC and abc;
            }, 
         }
         : {};

        //  console.log(keyword);
        //  this.query means product.find method!
         this.query = this.query.find({ ...keyword });
         return this;
    }

    filter(){

        // this section will we case sensitive because we will provide categoris in our feontend part

        const queryCopy = { ...this.queryStr };
        // removing some fields from category
        // console.log(queryCopy);
        const removeFields = [ "keyword", "page", "limit" ];
        removeFields.forEach( (key) =>delete queryCopy[key] );

        // filter for price and rating
        // console.log(queryCopy);
        
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=> `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr));
        // console.log(queryStr)

        // this.query = this.query.find(queryCopy);
        return this;
    }

    // pagination means how many products you want to show per page

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        // .limit() does Limit the Number of Returned Results
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    
};

module.exports = apiFeatures