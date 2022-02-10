let table;
let data;
let titles;
let dropdowns;

let settingsdropdown1;
let settingsdropdown2;

let outputDiv;

const modes = {
  printKNeighbors: (n) => printKNeighbors(n),
  recommendWithAvg: (n) => recommendWithAvg(n),
  recommendWithWeightedAvg: (n) => recommendWithWeightedAvg(n),
}

function preload() {
  // > python -m SimpleHTTPServer
  table = loadTable('assets/data.csv', 'header');
  data = [];
  dropdowns = [];
}

function setup() {
  noCanvas();

  titles = parseRowToTitles(table);
  const rows = table.getRows();
  rows.forEach(r => data.push(parseRowToObj(r)));

  const settingsDiv1 = createDiv('k = ');
  settingsdropdown1 = createSelect();
  settingsdropdown1.parent(settingsDiv1);
  for(let i=0; i<10; i++) settingsdropdown1.option(i+1);

  const settingsDiv2 = createDiv('mode = ');
  settingsdropdown2 = createSelect();
  settingsdropdown2.parent(settingsDiv2);

  const modeKeys = Object.keys(modes);
  modeKeys.forEach(m => settingsdropdown2.option(m));

  createDiv('<br/>');

  for(let i=0; i<7; i++){
    const div = createDiv(titles[i] + '<br/>');
    dropdowns.push(createSelect());
    dropdowns[i].parent(div);
    dropdowns[i].option('-');
    for(let j=0; j<5; j++) dropdowns[i].option(j+1);
  }

  createDiv('<br/>');
  const button = createButton('Submit');
  button.mousePressed(recommendMovies);
  createDiv('<br/>');

}

const recommendMovies = () => {
  let featureVector = [];
  dropdowns.forEach(d => featureVector.push(getRatingFromString(d.value())));
  
  const k = parseInt(settingsdropdown1.value());
  const neighbors = kNearestNeighbors(k, featureVector, data);

  modes[settingsdropdown2.value()](neighbors);
}

const printKNeighbors = (neighbors) => {
  console.log(neighbors)
  let output = '<b>kNearestNeighbors:</b><br/><br/>';
  neighbors.forEach(n => output += `${n.username}: ${n.similarity.toFixed(5)}<br/>`);

  if(outputDiv) outputDiv.remove();
  outputDiv = createDiv(output);
}

const recommendWithAvg = (neighbors) => {
  let featureVector = [];
  dropdowns.forEach(d => featureVector.push(getRatingFromString(d.value())));

  let recommendations = [];
  featureVector.forEach((feature, i) => {
    // Only if no rating is set
    if(!feature){
      let sum = 0;
      neighbors.forEach(neighbor => sum += isNaN(neighbor.featureVector[i]) ? 0 : neighbor.featureVector[i]);
      const rating = neighbors.length === 0 ? 0 : sum / neighbors.length;
      recommendations.push({title: titles[i], predictedRating: rating});
    }
  })

  let output = '<b>Recommendations:</b><br/><br/>';

  recommendations.sort((a, b) => b.predictedRating - a.predictedRating);

  recommendations.forEach(r => output += `${r.title}: ${r.predictedRating.toFixed(5)}<br/>`);

  if(outputDiv) outputDiv.remove();
  outputDiv = createDiv(output);
}

const recommendWithWeightedAvg = (neighbors) => {
  let featureVector = [];
  dropdowns.forEach(d => featureVector.push(getRatingFromString(d.value())));

  let recommendations = [];
  featureVector.forEach((feature, i) => {
    // Only if no rating is set
    if(!feature){
      let weightedSum = 0;
      let simSum = 0;
      neighbors.forEach(neighbor => {
        if(neighbor.featureVector[i]){
          weightedSum += neighbor.featureVector[i] * neighbor.similarity;
          simSum += neighbor.similarity;
        }
      });
      const weightedAvg = simSum === 0 ? 0 : weightedSum / simSum;
      recommendations.push({title: titles[i], predictedRating: weightedAvg});
    }
  })

  let output = '<b>Recommendations:</b><br/><br/>';

  recommendations.sort((a, b) => b.predictedRating - a.predictedRating);

  recommendations.forEach(r => output += `${r.title}: ${r.predictedRating.toFixed(5)}<br/>`);

  if(outputDiv) outputDiv.remove();
  outputDiv = createDiv(output);
}