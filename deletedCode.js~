        var parties = new Array;
        $.each(arr, function(key, item) {
            if(!parties[arr[key].party])
                parties[arr[key].party] = 0;
            ++parties[arr[key].party];
        });
        console.log(parties);
        
        var firstClass = _.countBy(arr, function(num) {
                        return num.perc >= 75 ? num.party : false;
                    });
        var secondClass = _.countBy(arr, function(num) {
                        return num.perc >= 65 && num.perc < 75 ? num.party : false;
                    });
        var thirdClass = _.countBy(arr, function(num) {
                        return num.perc < 65 ? num.party : false;
                    });

        var s = '';
        $.each(firstClass, function(key, item) {
            if(key != 'false')
                s += "<tr><td>" + key + "</td><td>" + item + "</td></tr>";
        })
        $(".party-perc-first").html(s);

        s = '';
        $.each(secondClass, function(key, item) {
            if(key != 'false')
                s += "<tr><td>" + key + "</td><td>" + item + "</td></tr>";
        })
        $(".party-perc-second").html(s);

        s = '';
        $.each(thirdClass, function(key, item) {
            if(key != 'false')
                s += "<tr><td>" + key + "</td><td>" + item + "</td></tr>";
        })
        $(".party-perc-third").html(s);

