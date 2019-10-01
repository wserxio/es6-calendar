/*
 * MODEL
 */
class CALENDAR {
	constructor(options) {
        this.OPTIONS = options ? options : null;
        this.DATE = new Date();
        this.DEFAULT_LOCALE = 'RU-ru'; // DEFAULT LOCALE
        this.DEFAULT_LOCALE_FORMAT = 'numeric'; // DEFAULT LOCALE FORMAT
        this.JSON = this.OPTIONS.events.parse ? fetch(this.OPTIONS.events.path) : null;
        this.EVENTS;
        this.DOM_ELEMENT = document.getElementById(options.el);
    }
    
    // calendar = this;

	get(dateFormat){ // main getter
        return this.DATE.toLocaleDateString(this.OPTIONS && this.OPTIONS.locale ? this.OPTIONS.locale : this.DEFAULT_LOCALE, dateFormat);
    }

    set(newdate){ //main setter
        this.DATE = new Date(newdate);
        return this;
    }

    year(format = this.DEFAULT_LOCALE_FORMAT){
        return this.get({year: format}); // "numeric", "2-digit"
    };

    month(format = this.DEFAULT_LOCALE_FORMAT){
        return this.get({month: format}); // "numeric", "2-digit", "narrow", "short", "long"
    };

    day(format = this.DEFAULT_LOCALE_FORMAT){
        return this.get({day: format}); // "numeric", "2-digit"
    };

    weekday(format = 'long'){
        return this.get({weekday: format}); // "narrow", "short", "long"
    };

    lDOM(){
        return new Date(this.year(), this.month(), 0).getDate() // last day of month, iterator depedence
    };

    offset(){
        return new Date(this.year(), this.month() - 1, 0).getDay() // offset
    };

    getEvents(){
        if (!this.JSON) return;

        this.JSON.then(r => {
            return r.json();
        }).then(events => {
           this.EVENTS = events;
        });

        return this;
    };

    matchDate(date){
        let buffer = [];
        for(let events in this.EVENTS){
            events == date ? buffer.push(this.EVENTS[date]) : null;
        };

        return buffer[0];
    };

    compose(){
        const calendar = this;
        return (function(){
            let
                cblock_weekdays = calendar.cnode().set('ul', {
                    attributes: {
                        class: 'cblock cblock--list cblock--weekdays'
                    }
                }),
                cblock_days = calendar.cnode().set('ul', {
                    attributes: {
                        class: 'cblock cblock--list cblock--days'
                    }
                }),
                zeroOffset,
                cheader = calendar.cnode().set('section', {
                    attributes: {
                        class: 'cheader'
                    }
                }),
                offset,
                cbody = calendar.cnode().set('section', {
                    attributes: {
                        class: 'cbody'
                    }
                }),
                cnav = calendar.cnode().set('nav', {
                    attributes: {
                        class: 'cnav nav--month'
                    },
                    html: calendar.cnode().set('ul', {
                        attributes: {
                            class: 'cblock cblock--list cblock--nav'
                        }
                    })
                }),
                day;
            return {
                header: function(){
                    calendar.cnode().setinside(cheader, this.title());

                    return cheader;
                },
                title: function(){
                    return calendar.cnode().set('div', {
                        attributes: {
                            class: 'ctitle title--month'
                        },
                        html: calendar.month('long')
                    });
                },
                buttons: function(){
                    for(let i = 0; i < 2; i++){
                        calendar.cnode().setinside(cnav)
                        calendar.cnode().setinside(cheader, 'button', {
                            attributes: {
                                type: 'button',
                                class: `cbutton button--${i == 0 ? 'prev' : 'next'}`
                            },
                            html: calendar.cnode().set('i', {
                                attributes: {
                                    class: `fa fa-arrow-${i == 0 ? 'left' : 'right'}`
                                }
                            })
                        })
                    }
                },
                body: function(){
                    calendar.cnode().setinside(cbody, this.weekdays());
                    calendar.cnode().setinside(cbody, this.days());

                    return cbody;
                },
                weekdays: function(){
                    // weekdays iterator
                    for(zeroOffset = 1; zeroOffset <= 7; zeroOffset++){
                        calendar.cnode().setinside(cblock_weekdays, 'li', {
                            html: new Date(`2019, 07, ${zeroOffset}`).toLocaleDateString('RU-ru', {weekday: 'short'})
                        });
                    }

                    return cblock_weekdays;
                },
                offset: function(){
                    // offset iterator
                    for(offset = 0; offset < calendar.offset(); offset++){
                        calendar.cnode().setinside(cblock_days, 'li', {
                            attributes: {
                                disabled: ''
                            }
                        });
                    };
                },
                days: function(){
                    this.offset();
                    // days iterator
                    for(day = 0; day < calendar.lDOM(); day++){
                        calendar.cnode().setinside(cblock_days, 'li', {
                            attributes: {
                                'aria-details': day + 1
                            },
                            html: day + 1
                        });
                    };
                    
                    return cblock_days;
                }
            }
        })();
    };

    cnode(){
        return (function(){
            let node, attribute;
            return {
                set: function(DOMnode = 'div', options = {}){
                    if(typeof DOMnode == 'object') return DOMnode;

                    node = document.createElement(DOMnode);

                    if(options.attributes) {
                        for(attribute in options.attributes){
                            node.setAttribute(attribute, options.attributes[attribute]);
                        };
                    }
                    options.html ? node.innerHTML = options.html : null;
                    return node;
                },
                setinside: function(ParentDOMElement, DOMnode, options = {}){
                    ParentDOMElement.appendChild(this.set(DOMnode, options));
                }
            }
        })()
    }
}

/*
 * VIEW
 */
class CALENDAR__VIEW extends CALENDAR {
    constructor(options){
        super(options);
        this.DOM_ELEMENT = document.getElementById(this.options.el);
    }

    header(){
        // weekdays iterator
    }

    offset(){
        // offset iterator
    }

    days(){
        // days iterator
    }

    normalize(){
        document.head.appendChild(`<link href="./css/normalize.css" rel="stylesheet"/>`);
    }

    icons(){
        document.head.appendChild(`<script src="https://kit.fontawesome.com/7ad76d5fa7.js"</script>`)
    }

    fontFamily(){
        document.head.appendChild(`<link href="https://fonts.googleapis.com/css?family=${this.OPTIONS.fontFamily.name.replace(' ', '+')}:100,300,400,500,700&display=swap&subset=cyrillic" rel="stylesheet">`);
        this.DOM_ELEMENT.style.fontFamily = this.OPTIONS.fontFamily.name;
    }
}

/*
 * CONTROLLER
 */
const mycalendar = new CALENDAR({
    el: 'calendar',
    events: {
        parse: true,
        path: '../js/events.json'
    }
});

/*
 * DEBUG
 */
// calendar.set('2019, 08, 14');

// (function(){
//     // weekdays
//     for(let zeroOffset = 1; zeroOffset <= 7; zeroOffset++){
//         console.log(new Date(`2019, 07, ${zeroOffset}`).toLocaleDateString('RU-ru', {weekday: 'short'})); //zero offset feature, may be incorrect
//     }
//     console.log('\n');
//     // offset
//     for(let offset = 0; offset < calendar.offset(); offset++){
//         console.log(offset + 1) //view doesn't matter
//     }
//     console.log('\n');
//     // days
//     for(let day = 0; day < calendar.lDOM(); day++){
//         console.log(day + 1)
//     }
// })();