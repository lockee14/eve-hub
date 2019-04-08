export const REGEXS: any = {
    contract : new RegExp(
        '^([\\S ]+)\\t' + // item_name
        '([0-9\\xA0]+)\\t' + // qty
        '[\\S ]*\\t' + // type
        '[\\S ]*\\t' + // category
        '[\\S ]*$' // details
        , 'i'),
    wallet_transaction : new RegExp(
        '^\\d{4}\\.\\d\\d\\.\\d\\d \\d\\d:\\d\\d\\t' + // date
        '([\\S ]+)\\t' + // item_name
        '[\\d,\'\\xA0]+ (?:ISK|AUR)\\t' + // price
        '([\\d,\'\\xA0]+)\\t' + // qty
        '[-\\d,\'\\xA0]+ (?:ISK|AUR)\\t' + // credit
        'ISK|AUR\\t' + // currency
        '[\\S ]+\\t' + // client
        '[\\S ]+$' // location
        , 'i'),
    planetary_interaction : new RegExp(
         '^([\\d,\'\\.]+)\\t' + // quantity
         '([\\S ]+)\\t' + // name
         '(Routed|Not\\ routed)$'
    , 'i'),
    view_content : new RegExp(
        '^([\\S ]*)\\t' + // name
        '[\\S ]*\\t' + // group
        '(?:Cargo Hold|Ore Hold|(?:Drone|Fuel) Bay|(?:Low|Medium|High|Rig) Slot|Subsystem|)\\t' + // location
        '([\\d,\'\\.]+)$' // quantity
    , 'i'),
    survey_scanner: new RegExp(
        '^([\\S ]+)\\t' + // name
        '([\\d,\'\\.]+)\\t' + // quantity
        '[\\d,\'\\.]*\\ (m|km)$' // distrance
    , 'i'),
    mining_ledger: new RegExp(
        '^\\d\\d\\d\\d\\.\\d\\d\\.\\d\\d\\t' + // date
        '([\\S\\ ]*)\\t' + // name
        '([\\d,\'\\.]+)\\t' + // quantity
        '[\\S\\ \\t]*' // reste
    , 'i'),
    looting_history: new RegExp(
        '^\\d\\d\\d\\d\\.\\d\\d\\.\\d\\d \\d\\d\\:\\d\\d\\t' + // date
        '[\\S ]+\\t' +  // chara name
        '([\\S ]+)\\t' + // name
        '([\\d,\'\\.\\ ]+)\\t' + // quantity
        '[\\S ]+' // category
    , 'i'),
    compare: new RegExp(
        '^([\\S\\ ]*)\\t' + // name
        '(?:Tech I|Tech II|Tech III|Faction|Deadspace|Storyline)' + // type
        '[\\S\\ \\t]*' // rest
    , 'i'),
    asset: new RegExp(
        '^([\\S\\ ]*)\\t' + // name
        '([\\d,\'\\xA0]+)' + // quantity
        '(?:\\t([\\S ]*))?' +
        '(?:\\t([\\S ]*))?' +
        '(?:\\t(XLarge|Large|Medium|Small|))?' +
        '(?:\\t(High|Medium|Low|Rigs|[\\d ]*))?' +
        '(?:\\t([\\d,\'\\xA0]+) (m3|м\\^3))?' +
        '(?:\\t([\\d]+|))?' +
        '(?:\\t([\\d]+|))?' +
        '(?:\\t([\\d,\'\\xA0]+) ISK)?$'
    , 'i'),
    name_quantity: new RegExp(
        '([0-9a-zA-Z\\ ]+(?=[0-9]*))' + // name
        '(?:\\t|\\ )' +
        '([\\d,\'\\xA0.]+)$' // quantity
    , 'i'),
    // name_quantity: new RegExp(
    //     '(?:^([a-zA-Z\\ ]+)' + // name
    //     '(?:\\t|\\ )' +
    //     '([\\d,\'\\xA0.]+)$)' // quantity
    // , 'i'),
    quantity_name: new RegExp(
        '^([\\d,\'\\xA0.]+)' + // quantity
        '(?:\\t|\\ )' +
        '([0-9a-zA-Z\\ ]+)$' // name
    , 'i'),
    // quantity_name: new RegExp(
    //     '(?:^([\\ \\d,\'\\xA0.]+)' + // quantity
    //     '(?:\\t|\\ )' +
    //     '([a-zA-Z\\ ]+)$)' // name
    // , 'i'),
    just_name: new RegExp(
        '^([0-9]*(?=[a-zA-Z])[a-zA-Z\\ ]+$)'
    , 'i')
    // just_name: new RegExp(
    //     '^([a-zA-Z\\ ]+)$'
    // , 'i')
};

// contract : new RegExp(
//   '^([\\S ]+)\\t' + // item_name (1)
//   '([0-9\\s]+)\\t' + // qty (2)
//   '([\\S ]*)\\t' + // type (3)
//   '([\\S ]*)\\t' + // category (4)
//   '([\\S ]*)$' // details (5)
//   , 'i'),
// wallet_transaction : new RegExp(
//   '^(\\d{4}\\.\\d\\d\\.\\d\\d \\d\\d:\\d\\d)\\t' + // date
//   '([\\S ]+)\\t' + // item_name
//   '([\\d,\'\\xA0]+ (?:ISK|AUR))\\t' + // price
//   '([\\d,\'\\xA0]+)\\t' + // qty
//   '([-\\d,\'\\xA0]+ (?:ISK|AUR))\\t' + // credit
//   '(ISK|AUR)\\t' + // currency
//   '([\\S ]+)\\t' + // client
//   '([\\S ]+)$' // location
//   , 'i'),
// planetary_interaction : new RegExp(
//      '^([\\d,'\\.]+)\\t' + // quantity
//      '([\\S ]+)\\t' + // name
//      '(Routed|Not\\ routed)$'
// , 'i'),
// view_content : new RegExp(
    // '^([\S ]*)\t' + // name
    // '[\S ]*\t' + // group
    // '(?:Cargo Hold|Ore Hold|(?:Drone|Fuel) Bay|(?:Low|Medium|High|Rig) Slot|Subsystem|)\t' + // location
    // '([\d,'\.]+)$' // quantity
// ,'i'),
// survey_scanner: new RegExp(
//     '^([\\S ]+)\\t' + // name
//     '([\\d,\'\\.]+)\\t' + // quantity
//     '[\\d,\'\\.]*\\ (m|km)$' // distrance
// , 'i'),
// mining_ledger: new RegExp(
//     '^\\d\\d\\d\\d\\.\\d\\d\\.\\d\\d\\t' + // date
//     '([\\S\\ ]*)\\t' + // name
//     '([\\d,\'\\.]+)\\t' + // quantity
//     '[\\S\\ \\t]*' //reste
// , 'i')
// looting_history: new RegExp(
//     '^\\d\\d\\d\\d\\.\\d\\d\\.\\d\\d \\d\\d\\:\\d\\d\\t' +
//     '[\\S ]+\\t' +
//     '([\\S ]+)\\t' +
//     '([\\d,\'\\.\\ ]+)\\t' +
//     '[\\S ]+'
// , 'i')
// compare: new RegExp(
//     '^([\\S\\ ]*)\\t' + // name
//     '(?:Tech I|Tech II|Tech III|Faction|Deadspace|Storyline)' + // type
//     '[\\S\\ \\t]*' // rest
// , 'i')
// asset: new RegExp(
//     '^([\\S\\ ]*)\\t' + // name
//     '([\\d,\'\\xA0]+)' + // quantity
//     '(?:\\t([\\S ]*))?' +
//     '(?:\\t([\\S ]*))?' +
//     '(?:\\t(XLarge|Large|Medium|Small|))?' +
//     '(?:\\t(High|Medium|Low|Rigs|[\\d ]*))?' +
//     '(?:\\t([\\d,\'\\xA0]+) (m3|м\\^3))?' +
//     '(?:\\t([\\d]+|))?' +
//     '(?:\\t([\\d]+|))?' +
//     '(?:\\t([\\d,\'\\xA0]+) ISK)?$'
// , 'i')
// name_quantity: new RegExp(
//     '(?:^([a-zA-Z\\ ]+)' + // name
//     '(?:\\t|\\ )' +
//     '([\\d,\'\\xA0.]+)$)' // quantity
// , 'i')
// quantity_name: new RegExp(
//     '(?:^([\\ \\d,\'\\xA0.]+)' + // quantity
//     '(?:\\t|\\ )' +
//     '([a-zA-Z\\ ]+)$)' // name
// , 'i')
// just_name: new RegExp(
//     '^([a-zA-Z\\ ]+)$'
// , 'i')
