//request from restful api
class HttpRequest {

    static get(url, params = {}) {
        return HttpRequest.request('GET', url, params);
    }

    static post(url, params = {}) {
        return HttpRequest.request('post', url, params);
    }
    static put(url, params = {}) {
        return HttpRequest.request('put', url, params);
    }
    static delete(url, params = {}) {
        return HttpRequest.request('delete', url, params);
    }

    static request(method, url, params = {}) {

        return new Promise((resolve, reject) => {

            let ajax = new XMLHttpRequest();

            ajax.open(method.toUpperCase(), url);

            ajax.onerror = event => {
                reject(event);
            }

            ajax.onload = event => {

                let obj = {};
                //response text is an atributte containing the information that the server responded 
                try {
                    obj = JSON.parse(ajax.responseText);
                }
                catch (e) {
                    console.log(e);
                    reject(e);
                }
                resolve(obj); //sends the obj to who called the promise
            };

            ajax.setRequestHeader('Content-Type', 'application/json');

            ajax.send(JSON.stringify(params));
        });

    }


}