const parseRowToObj = (r) => {
    return {
      id: '_' + Math.random().toString(36).substr(2, 9),
      username: r.arr[2],
      featureVector: [
        parseInt(r.arr[5]),
        parseInt(r.arr[8]),
        parseInt(r.arr[11]),
        parseInt(r.arr[14]),
        parseInt(r.arr[17]),
        parseInt(r.arr[20]),
        parseInt(r.arr[23])
      ]
    };
};

const parseRowToTitles = (r) => {
    return [
        r.columns[5],
        r.columns[8],
        r.columns[11],
        r.columns[14],
        r.columns[17],
        r.columns[20],
        r.columns[23]
        ];
};

const getRatingFromString = (s) => {
    const rating = parseInt(s);
    if(rating) return rating;
    return null;
}