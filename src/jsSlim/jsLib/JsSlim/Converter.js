(function () {
    // static class
    var self = {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        
        toBool: function (value) {
            if ('boolean' === typeof value) {
                return value;
            }
            if (value instanceof Boolean) {
                return value.valueOf();
            }
            if ('object' === typeof value) {
                value = "" + value;
            }
            if ('string' !== typeof value) {
                return false;
            }
            value = value.toLowerCase();
            return ('true' == value || 'yes' == value);
        },
        
        toNumber: function (value) {
            return this.returnValidNumber(1 * value);
        },
        
        toInt: function (value) {
            return this.returnValidNumber(parseInt(value, 10));
        },
        
        toDouble: function (value) {
            return this.returnValidNumber(parseFloat(value));
        },
        
        returnValidNumber: function (number) {
            if (isNaN(number)) {
                throw new JsSlim.Error('Type conversion error');
            }
            return number;
        },
        
        toArray: function (value) {
            if (value instanceof List) {
                value = value.toArray();
            } else {
                if (value instanceof String) {
                    value = "" + value;
                }
                if ('string' === typeof value) {
                    return self.stringToArray(value);
                }
            }
            var result = [];
            for (var i in value) {
                result[i] = self.javaToJs(value[i]);
            }
            return result;
        },
        
        javaToJs: function (value) {
            if (value instanceof List) {
                return self.toArray(value);
            }
            return value;
        },
        
        stringToArray: function (string) {
            if (('[' != string.charAt(0)) || (']' != string.charAt(string.length - 1))) {
                throw new JsSlim.Error('Invalid array serialization ' + string);
            }
            string = string.substr(1, string.length - 2);
            var array = string.split(',');
            for (var i in array) {
                array[i] = self.trim(array[i]);
            }
            return array;
        },
        
        trim: function (string) {
            return string.replace(/^\s+/, '').replace(/\s+$/, '');
        },
        
        toDate: function (value) {
            // Expected "dd-MMM-yyyy"
            var parts = value.split('-');
            return new Date(parts[0] + ' ' + parts[1] + ' ' + parts[2]);
        },
        
        toString: function (value) {
            if (undefined === value) {
                return '/__VOID__/';
            }
            if ('number' == typeof value) {
                return self.numberToString(value);
            }
            if (value instanceof Date) {
                return self.dateToString(value);
            }
            if (value instanceof Array) {
                return '[' + value.join(', ') + ']';
            }
            return "" + value;
        },
        
        numberToString: function (number) {
            if ((number !== 0) && (Math.abs(number) < 0.0001)) {
                number = number.toExponential();
            }
            if (Math.abs(number) >= 1e14) {
                number = number.toExponential();
            }
            return "" + number;
        },
        
        floatToString: function (number) {
            if ((number == Math.round(number)) && (Math.abs(number) < 1e14)) {
                return number.toFixed(1);
            }
            return self.numberToString(number);
        },
        
        dateToString: function (date) {
            return date.getDate() + '-' + self.getMonthString(date) + '-' + date.getFullYear();
        },
        
        getMonthString: function (date) {
            return self.months[date.getMonth()];
        },
        
        toJava: function (value) {
            if (value instanceof Array) {
                return self.toJavaList(value);
            }
            if (null === value) {
                return null;
            }
            return value;
        },
        
        toJavaList: function (array) {
            var list = new java.util.ArrayList();
            for (var i in array) {
                list.add(self.toJava(array[i]));
            }
            return list;
        },
        
        toJavaString: function (value) {
            if (value instanceof Array) {
                return self.toJavaListString(value);
            }
            if (null === value) {
                return null;
            }
            return self.toString(value);
        },
        
        toJavaListString: function (array) {
            var list = new java.util.ArrayList();
            for (var i = 0; i < array.length; i++) {
                list.add(self.toJavaString(array[i]));
            }
            return list;
        },
        
        hashListToPairsList: function (hashes) {
            var list = [];
            for (var i = 0; i < hashes.length; i++) {
                list.push(self.hashToPairs(hashes[i]));
            }
            return list;
        },
        
        hashToPairs: function (hash) {
            var list = [];
            var properties = self.getSortedProperties(hash);
            for (var i = 0; i < properties.length; i++) {
                var prop = properties[i];
                list.push([prop, hash[prop]]);
            }
            return list;
        },
        
        getSortedProperties: function (hash) {
            var properties = [];
            for (var prop in hash) {
                if (hash.hasOwnProperty(prop)) {
                    properties.push(prop);
                }
            }
            return properties.sort();
        },
        
        htmlTableToHash: function (html) {
            // This is ugly, but we cannot rely on HTML browser support.
            var inner = this._extractTableInner(String(html));
            if (undefined === inner || '' === inner) {
                return;
            }
            return this._htmlRowsToHash(inner);
        },
        
        _extractTableInner: function (html) {
            var extracted = this._extractInner('table', html);
            if (undefined === extracted || '' !== extracted.rest) {
                return;
            }
            return extracted.inner;
        },
        
        _htmlRowsToHash: function (inner) {
            var rows = this._getRows(inner);
            if (undefined === rows) {
                return;
            }
            var hash = {};
            for (var i = 0; i < rows.length; i++) {
                var row = this._getCells(rows[i]);
                if (2 != row.length) {
                    return;
                }
                hash[row[0]] = row[1];
            }
            return hash;
        },
        
        _getRows: function (tableInner) {
            return this._tagsToArray('tr', tableInner);
        },
        
        _getCells: function (rowInner) {
            return this._tagsToArray('td', rowInner);
        },
        
        _tagsToArray: function (tag, string) {
            var array = [];
            while ('' !== string) {
                var extracted = this._extractInner(tag, string);
                if (undefined === extracted) {
                    return;
                }
                array.push(extracted.inner);
                string = extracted.rest;
            }
            return array;
        },
        
        _extractInner: function (tag, string) {
            var openTag = '<' + tag + '>';
            var closeTag = '</' + tag + '>';
            try {
                var start = string.indexOf(openTag);
                var end = string.indexOf(closeTag);
            } catch (e) {
                print(string);
                print(e);
            }
            if (-1 == start || -1 == end) {
                return;
            }
            return {inner: this._trim(string.substring(start + openTag.length, end)), rest: this._trim(string.substr(end + closeTag.length))};
        },
        
        _trim: function (string) {
            return string.replace(/^\s+/, '').replace(/\s+$/, '');
        }
    };
    JsSlim.Converter = self;
})();
