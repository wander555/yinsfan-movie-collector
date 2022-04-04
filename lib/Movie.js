const Common = new require('./Common');
class Movie extends Common {

    async getData() {
        let url = 'https://www.yinfans.me';
        let result = await this.request(url, {
            headers: {
                referer: url
            }
        });
        let list = [];
        const $ = this.cheerio.load(result);
        var that = this;
        $('.post').each(function(i, el) {
            let date = $(this).find(".info_date").text()
            let title = $(this).find(".zoom").attr("title")
            let originalTitle = title.split("/")[0].split(" ")[0]
            let titleStrings = title.split(" ")
            let size = titleStrings[titleStrings.length - 1]
            let url = $(this).find(".zoom").attr("href")
            let movieIds = url.split("/")
            let movieId = movieIds[movieIds.length - 1]
            list.push({
                title: title,
                originalTitle: originalTitle,
                url: url,
                movieId: movieId,
                size: size,
                date: date
            })

            if (i == 1) {
                console.log(that.getMovieDetail(movieId))
            }
        });

        return list
    }


    async getMovieDetail(movieId) {
        let url = 'https://www.yinfans.me/movie/' + movieId;
        let result = await this.request(url, {
            headers: {
                referer: url
            }
        });
        let list = [];
        const $ = this.cheerio.load(result);
        var that = this;

        $("#cili").find("tr").each(function(i, el) {
            let torrent = $(this).find("a").attr("href");
            let movieQuality = $(this).find(".label-danger").text()
            let movieSize = $(this).find(".label-warning").text()

            if (movieQuality.indexOf("4k") != -1 || movieQuality.indexOf("1080") != -1 || movieQuality.indexOf("蓝光") != -1) {
                list.push({
                    torrent: torrent,
                    movieQuality: movieQuality,
                    movieSize: movieSize
                })
            }
        })

        return list;
    }
}
module.exports = Movie;