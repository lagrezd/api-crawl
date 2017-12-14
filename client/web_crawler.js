$( document ).ready(function(){

    $("#input-form").submit(function(ev){
        //prevent redirecting
        ev.preventDefault();

        //declare container for user inputted urls
        var inputData = {
            urls: [],
        };

        //iterate through user input and populate urls array
        $(this).children('input').each(function(){
            if(this.value){
                inputData.urls.push(this.value);
            }
        })
        //console.log(inputData);

        //send post request to server with urls in payload
        $.ajax({
            type: "POST",
            url: '/urls',
            data: inputData,
            dataType: 'json',

            success: function(urlData) {
                console.log("Successfully retrieved  url data ", urlData);

                for(var url in urlData) {

                    console.log(url);
                    var phoneNumber = document.createElement("div");
                    var i = Object.keys(urlData).indexOf(url) + 1;
                    phoneNumber.innerText = url + " - " + i;
                    $('#output-data').append(phoneNumber);
                    /*for(var number in urlData[url]) {

                        console.log(number);

                        var phoneNumber = document.createElement("div");
                        phoneNumber.innerText = number;
                        $('#output-data').append(phoneNumber);
                        //$('#output-data').append(phoneNumber);
                    }*/
                }
            },

            error: function(err) {
                console.log("Problem fetching url data: ", err)
                window.alert("Hmm. Looks like we had trouble finding data for the urls you provide");
            }
        });

    });
});