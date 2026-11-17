
function init() {
  ['truckGvwr', 'truckCurb', 'truckGcwr', 'cargoPassengers', 'trailerWeight', 'hitchType'].forEach(id => {
    document.getElementById(id).addEventListener('change', calc);
    document.getElementById(id).addEventListener('input', calc);
  });
  calc();
}

function calc() {
  const gvwr = parseFloat(document.getElementById('truckGvwr').value)||7100;
  const curb = parseFloat(document.getElementById('truckCurb').value)||5300;
  const gcwr = parseFloat(document.getElementById('truckGcwr').value)||15000;
  const cargo = parseFloat(document.getElementById('cargoPassengers').value)||650;
  const trailer = parseFloat(document.getElementById('trailerWeight').value)||7000;
  const hitch = document.getElementById('hitchType').value;

  const totalPayload = gvwr - curb;
  const payloadAvailable = totalPayload - cargo;

  const tonguePct = hitch === "bumper" ? 0.12 : 0.20;
  const tongueWt = trailer * tonguePct;

  const remainingPayload = payloadAvailable - tongueWt;
  const totalCombinedWeight = curb + cargo + trailer;
  const remainingGcwr = gcwr - totalCombinedWeight;

  // Max trailer limited by payload: payloadAvailable / tonguePct
  const maxTrailerByPayload = payloadAvailable / tonguePct;
  const maxTrailerByGcwr = gcwr - curb - cargo;
  const maxTrailerPossible = Math.round(Math.min(maxTrailerByPayload, maxTrailerByGcwr));

  const verdictEl = document.getElementById('towingVerdict');
  let verdict = "SAFE TO TOW";
  let vColor = "#4ade80";
  let limitText = `Payload Margin: ${Math.round(remainingPayload)} lbs Remaining`;

  if (remainingPayload < 0 && remainingGcwr < 0) {
    verdict = "OVERLOADED (PAYLOAD & GCWR)";
    vColor = "#f87171";
    limitText = `Over Payload by ${Math.abs(Math.round(remainingPayload))} lbs!`;
  } else if (remainingPayload < 0) {
    verdict = "OVERLOADED PAYLOAD";
    vColor = "#f87171";
    limitText = `Hitch Exceeds Truck Payload by ${Math.abs(Math.round(remainingPayload))} lbs!`;
  } else if (remainingGcwr < 0) {
    verdict = "OVERLOADED GCWR";
    vColor = "#f87171";
    limitText = `Exceeds Combined Weight by ${Math.abs(Math.round(remainingGcwr))} lbs!`;
  }

  verdictEl.textContent = verdict;
  verdictEl.style.color = vColor;
  document.getElementById('limitingFactor').textContent = limitText;
  document.getElementById('maxTrailerPossible').textContent = `Max Safe Trailer: ${maxTrailerPossible.toLocaleString()} lbs`;
  document.getElementById('tongueWeight').textContent = `${Math.round(tongueWt)} lbs (${Math.round(tonguePct*100)}%)`;
  document.getElementById('availablePayload').textContent = `${Math.round(payloadAvailable)} lbs`;
  document.getElementById('totalCombined').textContent = `${Math.round(totalCombinedWeight).toLocaleString()} lbs`;
  document.getElementById('gcwrMargin').textContent = `${remainingGcwr >= 0 ? '+' : ''}${Math.round(remainingGcwr).toLocaleString()} lbs`;
  document.getElementById('wdhRequired').textContent = trailer >= 5000 ? "Required (Over 5,000 lbs)" : "Recommended";
}
window.addEventListener('DOMContentLoaded', init);
