const kNearestNeighbors = (k, featureVector, users) => {

    let similarities = [];
    users.forEach(u => similarities.push({
        id: u.id,
        similarity: calcSimilarity(u.featureVector, featureVector)
    }));
  
    similarities.sort((a, b) => b.similarity - a.similarity);
  
    let kUsers = [];
    for(let i=0; i<k && i<users.length; i++){
        const user = users.find(u => u.id === similarities[i].id);
        kUsers.push({...user, similarity: similarities[i].similarity});
    }
  
    return kUsers;
};
  
const calcSimilarity = (v1, v2) => {
    const d = calcEuclideanDistance(v1, v2);
    return 1 / (1 + d);
}
  
const calcEuclideanDistance = (v1, v2) => {
    let sum = 0;
    v1.forEach((v, i) => (v && v2[i]) ? sum += (v-v2[i]) * (v-v2[i]) : null);
    return sum;
}