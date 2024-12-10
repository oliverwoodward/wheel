let teamMembers = ['Oliver', 'Cason', 'Brandon', 'Miss', 'Daragh', 'Colm', 'Sean', 'Aruna', 'Jasmine', 'Danny'];
const canvas = document.getElementById('spinnerCanvas');
const ctx = canvas.getContext('2d');
const controlsDiv = document.getElementById('controls');
const memberListDiv = document.getElementById('memberList');
const resultPopup = document.getElementById('result-popup');
const resultDiv = document.getElementById('result');
let numberOfSlices;
let anglePerSlice;
let startAngle = 0;
let spinAngle = 0;
let spinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numberOfSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle + (i * anglePerSlice), startAngle + ((i + 1) * anglePerSlice));
        ctx.fillStyle = i % 2 === 0 ? '#444' : '#666';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + (i * anglePerSlice) + anglePerSlice / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(teamMembers[i], canvas.width / 2 - 10, 0);
        ctx.restore();
    }
}

function updateWheel() {
    const excludedMembers = Array.from(document.querySelectorAll('input[type="checkbox"]:not(:checked)'))
                                .map(input => input.value);
    teamMembers = excludedMembers;
    numberOfSlices = teamMembers.length;
    anglePerSlice = (2 * Math.PI) / numberOfSlices;
    drawWheel();
}

function spin() {
    if (!spinning) {
        spinning = true;
        let spinDuration = Math.random() * 3000 + 2000; // Spin between 2 to 5 seconds
        let spinStart = performance.now();
        requestAnimationFrame(function spinAnimation(time) {
            let progress = time - spinStart;
            spinAngle = progress / spinDuration * 360 * 4; // Spin more for faster effect
            startAngle += (spinAngle * Math.PI / 180) % (2 * Math.PI);
            drawWheel();
            if (progress < spinDuration) {
                requestAnimationFrame(spinAnimation);
            } else {
                spinning = false;
                announceWinner();
            }
        });
    }
}

function announceWinner() {
    let winningIndex = Math.floor((startAngle / anglePerSlice) + numberOfSlices) % numberOfSlices;
    resultDiv.textContent = `Today's standup leader is: ${teamMembers[winningIndex]}`;
    resultPopup.classList.remove('hidden');
}

function setupMembers() {
    teamMembers.forEach(member => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.value = member;
        checkbox.addEventListener('change', updateWheel);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(member));
        memberListDiv.appendChild(label);
        memberListDiv.appendChild(document.createElement('br'));
    });
}

function removeAndSpinAgain() {
    const winner = resultDiv.textContent.split(': ')[1];
    teamMembers = teamMembers.filter(member => member !== winner);
    updateWheel();
    resultPopup.classList.add('hidden');
    if (teamMembers.length > 0) {
        spin();
    } else {
        alert("All team members have been selected!");
    }
}

setupMembers();
updateWheel();

document.getElementById('spinButton').addEventListener('click', spin);
document.getElementById('removeButton').addEventListener('click', removeAndSpinAgain);
