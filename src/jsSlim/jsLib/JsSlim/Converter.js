(function () {
    // static class
    var Converter = {
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
            if (value instanceof Date) {
                return self.dateToString(value);
            }
            if (value instanceof Array) {
                return '[' + value.join(', ') + ']';
            }
            return "" + value;
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
            for (var i in array) {
                list.add(self.toJavaString(array[i]));
            }
            return list;
        }
    };
    var self = Converter;
    JsSlim.Converter = Converter;
})();
