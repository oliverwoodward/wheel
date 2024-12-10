const teamMembers = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve']; // Add team members here
const canvas = document.getElementById('spinnerCanvas');
const ctx = canvas.getContext('2d');
const numberOfSlices = teamMembers.length;
let anglePerSlice = (2 * Math.PI) / numberOfSlices;
let startAngle = 0;
let spinAngle = 0;
let spinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numberOfSlices; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, startAngle + (i * anglePerSlice), startAngle + ((i + 1) * anglePerSlice));
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FF8C00';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(startAngle + (i * anglePerSlice) + anglePerSlice / 2);
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(teamMembers[i], canvas.width / 2 - 10, 0);
        ctx.restore();
    }
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
    document.getElementById('result').textContent = `Today's standup leader is: ${teamMembers[winningIndex]}`;
}

drawWheel();

document.getElementById('spinButton').addEventListener('click', spin);
