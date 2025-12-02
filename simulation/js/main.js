const getElement = (id) => {
    return document.getElementById(id);
}

const rpm_input = getElement('rpm')
const q_input = getElement('q')
const diameter_input = getElement('diameter')
const startButton = getElement('playButton_cor')
const pauseButton = getElement('pauseButton_cor')
const resetButton = getElement('resetButton_cor')
const lockButton = getElement('lock_cor')

const canvas = getElement("cnv");
const context = canvas.getContext('2d');

const topx = 120;
const topy = 40;



// constants for calculations
const g = 9.81 // m/sec^2
const density_water = 1000 // kilograms per cubic meter
const L = 0.329 // length of pipe
const R = 0.112 // Radius of Torque arm
const length_torque_arm = 0.06

var period = 2000

var rpm = 40 // rpm
var Q = 500 // LPH
var D = 8 // diameter of pipes
var A = 1/10000


var torque_reading = 0
var rotameter_reading = 0
var springBalance_reading = ((Math.random() * (0.4-0.1))+0.1).toFixed(3)


rpm_input.addEventListener("input",()=>{
    rpm = parseInt(rpm_input.value);
    getElement('rpm_value').innerText = rpm;
})

q_input.addEventListener("input",()=>{
    Q = parseInt(q_input.value);
    getElement('q_value').innerText = Q;

})

diameter_input.addEventListener("input",()=>{
    D = parseInt(diameter_input.value)
    A = (2 * Math.PI * D * D)/(4*1000*1000)
    getElement('diameter_value').innerText = D;
})



function calculate_theoretical_acc(){
    const omega = (rpm*2*Math.PI)/60
    const acc = 2*velocity*omega;
    return acc;
}



function calculate_theoretical(){
    const omega = (rpm * 2 * Math.PI )/60;
    var q_m3ps = Q/(3.6*1000000) // flow rate in m3/sec
    var velocity = q_m3ps/A;

    const accceleration_theoretical = 2 * velocity * omega

    console.log(accceleration_theoretical);

    return [accceleration_theoretical,velocity]

}





const checkBox_cor = () =>{
    if (lockButton.checked){
        var theoretical_values = calculate_theoretical();
        getElement("cor_theoretical").innerText = `Theoretical Acc. Coriolis : ${theoretical_values[0].toFixed(2)} m/s²`
        getElement('velocity_theoretical').innerText = `Velocity : ${theoretical_values[1].toFixed(2)} m/s`
        period = ((60/rpm)*1000)*2
        q_input.hidden =true;
        rpm_input.hidden = true;
        diameter_input.hidden = true;
        getElement('lock_cor').disabled = true;
        
    }
    else{

        resetAnimation_cor()

        // q_input.hidden =false;
        // rpm_input.hidden = false;
        // diameter_input.hidden = false;
    }


}












// Water rectangle dimensions
const waterRect = {
    x: topx + 20,
    y: topy + 27 , // Position below the flow tubes
    width: 360,
    height: 80,
};

const particles = [];
const numParticles = 50; // Number of particles
const rotationSpeed = 0.09; // Speed of rotation
let angle = 0; // Current angle for rotation

// Create particles randomly within the water rectangle
for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * waterRect.width + waterRect.x; // Random x within the rectangle
    const y = Math.random() * waterRect.height + waterRect.y; // Random y within the rectangle
    particles.push({
        x: x,
        y: y,
        radius: 1, // Random radius for particles
    });
}

function drawOuterStructure() {
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    context.strokeRect(topx, topy, 400, 450);

    context.beginPath();
    context.moveTo(topx, topy + 134);
    context.lineTo(topx + 400, topy + 134);
    context.stroke();

    context.strokeRect(topx + 20, topy + 27, 360, 80);
    context.strokeRect(topx + 190, topy + 27, 20, 20);
    context.strokeRect(topx + 180, topy + 27 + 20, 40, 25);
    context.strokeRect(topx + 190, topy + 27 + 20 + 25, 20, 15);
    context.strokeRect(topx + 180, topy + 27 + 20 + 25 + 15, 40, 20);
}

function drawFlowtube(time) {
    // Animation parameters
     // 5 seconds per complete rotation
    const phase = (time % period) / period; // 0 to 1
    
    // Calculate perspective effect using sine wave
    const perspective1 = Math.abs(Math.sin(phase * 2 * Math.PI));
    const perspective2 = Math.abs(Math.sin((phase + 0.5) * 2 * Math.PI));
    
    // Base dimensions
    const maxLength = 150;
    const tubeWidth = 9;
    
    // Calculate current lengths based on perspective
    const length1 = maxLength * perspective1;
    const length2 = maxLength * perspective2;
    
    context.strokeStyle = 'brown';
    context.lineWidth = 2;
    
    // Draw left tube with varying length
    context.strokeRect(
        topx + 180,
        topy + 55,
        -length1,  // Length varies with perspective
        tubeWidth
    );
    
    // Draw right tube with varying length
    context.strokeRect(
        topx + 220,
        topy + 55,
        length2,   // Length varies with perspective
        tubeWidth
    );

    // Optional: Add shading effect based on perspective
    const gradient1 = context.createLinearGradient(
        topx + 180,
        topy + 55,
        topx + 180 - length1,
        topy + 55
    );
    gradient1.addColorStop(0, 'rgba(139, 69, 19, 0.6)');
    gradient1.addColorStop(1, 'rgba(139, 69, 19, 0.2)');
    
    const gradient2 = context.createLinearGradient(
        topx + 220,
        topy + 55,
        topx + 220 + length2,
        topy + 55
    );
    gradient2.addColorStop(0, 'rgba(139, 69, 19, 0.6)');
    gradient2.addColorStop(1, 'rgba(139, 69, 19, 0.2)');
    
    // Fill tubes with gradients
    context.fillStyle = gradient1;
    context.fillRect(topx + 180, topy + 55, -length1, tubeWidth);
    
    context.fillStyle = gradient2;
    context.fillRect(topx + 220, topy + 55, length2, tubeWidth);
}

function drawWater() {
    // Draw the water rectangle
    context.fillStyle = 'rgba(186, 222, 249, 0.8)'; // Water color with transparency
    context.fillRect(waterRect.x, waterRect.y, waterRect.width, waterRect.height);
}

function drawParticles() {
    context.fillStyle = 'rgba(0, 147, 255, 0.8)'; // Particle color
    particles.forEach(p => {
        // Calculate new particle position based on rotation around the center of the rectangle
        const centerX = waterRect.x + waterRect.width / 2;
        const centerY = waterRect.y + waterRect.height / 2;

        const offsetX = Math.cos(angle) * (p.radius + 2); // Radius + 2 for rotation distance
        const offsetY = Math.sin(angle) * (p.radius + 2); // Radius + 2 for rotation distance

        context.beginPath();
        context.arc(p.x + offsetX, p.y + offsetY, p.radius, 0, Math.PI * 2); // Particle size
        context.fill();
    });
}


function drawRotameter() {
    // Set up the drawing context
    context.strokeStyle = 'black';
    context.lineWidth = 1.5;

    // Draw the outer rectangle of the rotameter
    context.strokeRect(topx, topy + 50, -50, 200);
    context.strokeRect(topx - 5, topy + 50 + 10, -40, 180);
    context.strokeRect(topx - 5 - 10, topy + 50 + 10, -20, 180);


    
    



// Set the fill style to light blue
context.fillStyle = 'rgba(44, 165, 252, 0.8)'

// Upper part connection
context.fillRect(topx - 10, topy + 50, -30, -20); // Fill the first rectangle
context.fillRect(topx - 15, topy + 30, -20, -10); // Fill the second rectangle

// Pipe
context.fillRect(topx - 20, topy + 20, -10, -50); // Fill the vertical pipe
context.fillRect(topx - 30, topy - 30, 220, -10); // Fill the horizontal pipe
context.fillRect(topx + 190, topy - 40, 20, 40); // Fill the right vertical pipe


   
}




function drawController(){
   context.strokeStyle = 'black'
    context.strokeRect(topx+300,topy+134,100,130)
    context.strokeRect(topx+360,topy+150,30,30)
    context.strokeRect(topx+365,topy+155,20,20)

    const centerX = topx + 340;
const centerY = topy + 210;
const radiusOuter = 20; // radius of the outer circle
const spikeLength = 5; // length of each spike
const numSpikes = 6; // Number of spikes you want (you can change this)

// Draw outer circle
context.beginPath();
context.arc(centerX, centerY, radiusOuter, 0, 2 * Math.PI);
context.stroke();

// Draw inner circle
context.beginPath();
context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
context.stroke();




// Draw spikes around the outer circle
for (let i = 0; i < numSpikes; i++) {
    // Calculate the angle for each spike (evenly spaced around the circle)
    const angle = i * (2 * Math.PI / numSpikes);

    // Starting point on the outer circle
    const startX = centerX + radiusOuter * Math.cos(angle);
    const startY = centerY + radiusOuter * Math.sin(angle);

    // Ending point beyond the outer circle for the spike
    const endX = centerX + (radiusOuter + spikeLength) * Math.cos(angle);
    const endY = centerY + (radiusOuter + spikeLength) * Math.sin(angle);

    // Draw the spike
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();


}


context.strokeRect(topx+370,topy+200,20,50)
context.fillStyle= 'green'
context.fillRect(topx+375,topy+205,10,10)
context.fillStyle= 'red'
context.fillRect(topx+375,topy+235,10,10)


}






function drawSpringBalance() {
    // Set the font style globally
    context.font = "10px Arial";
    context.textBaseline = "middle"; // This ensures vertical alignment of the text
    context.textAlign = "center";    // This ensures horizontal alignment is centered

    // Set line dash for the top part of the spring balance
    context.setLineDash([5, 10]);
    context.beginPath();
    context.moveTo(topx + 200, topy + 134 - 20);
    context.lineTo(topx + 200, topy + 250);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();
    context.setLineDash([]); // Reset the dash pattern to solid line for future drawings

    // Draw the spring balance box
    context.strokeRect(topx + 100, topy + 200, 180, 100);
    context.fillStyle = 'black';
    context.fillRect(topx + 290, topy + 134, 3, 316);

    // Upper part of the spring balance
    context.fillStyle = 'rgba(131, 128, 133, 0.8)';
    context.fillRect(topx + 150, topy + 200, 130, -10);
    context.fillRect(topx + 150, topy + 300, 130, 10);

    context.strokeRect(topx + 280, topy + 180, 10, 140);

    context.fillStyle = 'black';
    context.fillRect(topx + 15, topy + 134, 2, 316);
    context.fillRect(topx + 5, topy + 134, 2, 316);

    // Water pump
    context.fillRect(topx + 160, topy + 435, 60, 10);
    context.fillStyle = 'rgba(44, 165, 252, 0.8)';
    context.fillRect(topx + 155, topy + 413, -130, -10);
    context.fillRect(topx + 30, topy + 413, -10, -278);

    // Spring balance
    context.strokeRect(topx + 20, topy + 235, 70, 25);
    context.strokeRect(topx + 90, topy + 242, 10, 10);

    context.beginPath();
    context.moveTo(topx + 90 + 10, topy + 247);
    context.lineTo(topx + 90 + 110, topy + 247);
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = 'black';
    context.fillRect(topx + 195, topy + 245, 10, 5);
    context.fillRect(topx + 160, topy + 243, 15, 8);

    // Actual spring balance
    context.strokeRect(topx + 440, topy + 200, 60, 200);
    context.strokeRect(topx + 460, topy + 210, 1, 180);

    var gap = 0;
    var scalereading = 0;
    for (var i = 0; i < 6; i++) {
        context.strokeRect(topx + 450, topy + 220 + gap, 20, 0);
        context.fillText(scalereading, topx + 480, topy + 225 + gap);
        gap += 30;
        scalereading += 1;
    }

    gap = 0;
    for (var i = 0; i < 35; i++) {
        context.strokeRect(topx + 455, topy + 220 + gap, 10, 0);
        gap += 5;
    }

    context.strokeRect(topx + 440, topy + 400, 60, 25);

    // Rotameter scale with adjusted font size
    context.font = "8px Arial"; // Adjust font size for the scale values
    context.fillStyle = 'black';

    gap = 0;
    var value = 10;
    for (var i = 0; i < 10; i++) {
        context.fillText(value, topx - 25, topy + 80 + gap); // Center the text horizontally
        gap += 16;
        value += 10;
    }
}







function showValues (){
        context.strokeStyle = 'black'

        context.beginPath();
        context.arc(topx+55, topy+248,15, 0, Math.PI * 2); 
        context.stroke();

        context.beginPath();
        context.moveTo(topx+55, topy+248+15);
        context.lineTo(topx+55, topy+248+15+60);
        context.moveTo(topx+55, topy+248+15+60);
        context.lineTo(topx+440, topy+248+15+60);
        context.stroke();


        context.beginPath();
        context.arc(topx-25, topy+150,15, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.moveTo(topx-40, topy+150);
        context.lineTo(topx-80, topy+150);
        context.moveTo(topx-80, topy+150);
        context.lineTo(topx-80, topy+270);
        context.stroke();

        context.strokeRect(topx-100,topy+270,50,30)



        context.font = "18px Arial";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(springBalance_reading,topx+470,topy+415)
    

        context.font = "18px Arial";
        context.fillStyle = "red"; // White color for the text
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(rotameter_reading,topx-75,topy+288)

        





    


}


function draw_springBalanceReader(reader_length){

    
    context.fillStyle = 'rgba(249, 224, 128, 0.8)'

    context.fillRect(topx+30,topy+240,reader_length,15)
    
}

draw_springBalanceReader()







var isAnimating = false;

let reader_length = 0;





// Animation loop
var waterAnimationId
function draw_animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
   

    drawRotameter()
    drawWater(); // Draw the water
    drawParticles(); // Draw the particles
    drawOuterStructure();
    drawFlowtube(performance.now());
    draw_springBalanceReader(reader_length)
    reader_length += 0.01
    reader_length = reader_length % 50

    
    drawController()
    drawSpringBalance()
   
    showValues()

    angle += rotationSpeed; // Increment the angle for rotation
    if (isAnimating) waterAnimationId = requestAnimationFrame(draw_animate);
}





    drawWater(); // Draw the water
    drawParticles(); // Draw the particles
    drawOuterStructure();
    drawRotameter(50)
    drawController()
    drawSpringBalance()
    drawFlowtube(562);
    showValues()


    var omega;
    var q_m3ps;
    var velocity;
    var initial_sb;
    var mass_rate;
    var f_cor;
    var final_sb;
    var torque;
    var acceleration_experimental;
    var accelerationTheoritcal;
    
    // Data to show in the table
    var resultsData = {};
    
    const showFinalResults_cor = () => {
      omega = (rpm * 2 * Math.PI) / 60; // rad/sec
      q_m3ps = Q / (3.6 * 1000000); // flow rate in m³/sec
      velocity = q_m3ps / A;
    
      initial_sb = Number(springBalance_reading);
      mass_rate = density_water * q_m3ps;
      f_cor = (2 * mass_rate * velocity * omega) / g;
      final_sb = f_cor + initial_sb;
    
      torque = (final_sb - initial_sb) * length_torque_arm;
    
      acceleration_experimental = (g * torque) / (density_water * A * L * L);
      [accelerationTheoritcal,_] = calculate_theoretical()
    
      console.log(`mass rate ${mass_rate}`);
      console.log(`f cor: ${f_cor}`);
      console.log(`Initial Sb ${initial_sb}`);
      console.log(`Final sb ${final_sb}`);
      console.log(`Torque`, torque);
      console.log(`Acceleration Experimental`, acceleration_experimental);
      console.log(D, A);
    
      springBalance_reading = Number(final_sb).toFixed(3);
      rotameter_reading = (A * velocity * 1000 * 60).toFixed(2); // Q in LPH
      draw_animate();
    
      getElement('discharge').innerText = `${q_m3ps.toExponential(2)} m³/sec`;
      getElement('velocity').innerText = `${velocity.toFixed(2)} m/sec`;
      getElement('torque').innerText = `${torque.toExponential(2)} N·m`;
      getElement('result_cor').innerText = `${acceleration_experimental.toFixed(3)} m/s²`;
    
      getElement('showResultsButton').hidden = false;
   
    
      // Data to show in the table
      resultsData = {
        "Omega (ω)": omega.toFixed(3),
        "Flow Rate (Q m³/s)": q_m3ps.toExponential(2),
        "Velocity (m/s)": velocity.toFixed(2),
        "Initial SB": initial_sb.toFixed(4),
        "Mass Rate (kg/s)": mass_rate.toFixed(3),
        "Final SB": final_sb.toFixed(4),
        "Torque (N·m)": torque.toExponential(2),
        "Acceleration (m/s²)": acceleration_experimental.toFixed(3),
      };
    };
    
    function showPopupResults() {
        const modal = document.getElementById('resultsModal');
        const inputDataList = document.getElementById('inputDataList');
        const tableContainer = document.getElementById('resultsTableContainer');
      
        // Function to format numbers in a × 10^b notation
        function toPowerNotation(num, decimals = 3) {
          if (num === 0) return '0';
          const exponent = Math.floor(Math.log10(Math.abs(num)));
          const base = (num / Math.pow(10, exponent)).toFixed(decimals);
          return `${base} × 10<sup>${exponent}</sup>`;
        }
      
        // Inputs Data
        const inputsData = {
          "Bore Diameter of Tube (D)": `${D.toFixed(2)} mm`,
          "Total Flow Area (a)": `${A.toFixed(4)} m²`,
          "Length of Torque Arm (l)": `${length_torque_arm.toFixed(2)} m`,
          "Acceleration Due to Gravity (g)": "9.81 m/s²",
          "Angular Velocity (ω)": `${omega.toFixed(2)} rad/s`,
          "Flow Rate (Q)": `${(q_m3ps * 3600000).toFixed(2)} LPH`,
          "Specific Weight of Fluid (Water)": "1000 kg/m³",
          "Effective Length of Rotating Tube (L)": `${L.toFixed(2)} m`,
        };
      
        // First Table Data
        const firstTableData = [
          {
            "Speed (RPM)": rpm,
            "Initial SB (Kg)": Number(initial_sb).toFixed(4),
            "Final SB (Kg)": Number(final_sb).toFixed(4),
            "Water Flow (LPH)": toPowerNotation(q_m3ps * 3600000),
          },
        ];
      
        // Second Table Data
        const secondTableData = [
          {
            "Discharge (m³/s)": toPowerNotation(q_m3ps, 2),
            "Velocity (m/s)": velocity.toFixed(2),
            "Theoretical Acceleration (m/s²)": accelerationTheoritcal.toFixed(3),
            "Torque (N·m)": toPowerNotation(torque, 2),
            "Experimental Acceleration (m/s²)": acceleration_experimental.toFixed(3),
          },
        ];
      
        // Generate Inputs HTML
        let inputsHTML = '';
        for (const [key, value] of Object.entries(inputsData)) {
          inputsHTML += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        inputDataList.innerHTML = inputsHTML;
      
        // Generate First Table HTML
        let firstTableHTML = '<table>';
        firstTableHTML += '<thead><tr><th>Speed (RPM)</th><th>Initial SB (Kg)</th><th>Final SB (Kg)</th><th>Water Flow (LPH)</th></tr></thead><tbody>';
        firstTableData.forEach(row => {
          firstTableHTML += `<tr><td>${row["Speed (RPM)"]}</td><td>${row["Initial SB (Kg)"]}</td><td>${row["Final SB (Kg)"]}</td><td>${row["Water Flow (LPH)"]}</td></tr>`;
        });
        firstTableHTML += '</tbody></table>';
      
        // Generate Second Table HTML
        let secondTableHTML = '<table>';
        secondTableHTML += '<thead><tr><th>Discharge (m³/s)</th><th>Velocity (m/s)</th><th>Theoretical Acceleration (m/s²)</th><th>Torque (N·m)</th><th>Experimental Acceleration (m/s²)</th></tr></thead><tbody>';
        secondTableData.forEach(row => {
          secondTableHTML += `<tr><td>${row["Discharge (m³/s)"]}</td><td>${row["Velocity (m/s)"]}</td><td>${row["Theoretical Acceleration (m/s²)"]}</td><td>${row["Torque (N·m)"]}</td><td>${row["Experimental Acceleration (m/s²)"]}</td></tr>`;
        });
        secondTableHTML += '</tbody></table>';
      
        // Insert tables into modal container
        tableContainer.innerHTML = `
          <div class="table-wrapper">
            <div class="table-container">${firstTableHTML}</div>
            <div class="table-container">${secondTableHTML}</div>
          </div>
        `;
      
        // Show modal
        modal.style.display = 'block';
      }
      
    
      
      // Function to download data as CSV
      function downloadResults() {
        const firstTableHeaders = ["Speed (RPM)", "Initial SB (Kg)", "Final SB (Kg)", "Water Flow (LPH)"];
        const firstTableValues = [rpm, initial_sb, final_sb, q_m3ps * 3600000];
      
        const secondTableHeaders = ["Discharge (m³/s)", "Velocity (m/s)", "Theoretical Acceleration (m/s²)", "Torque (N·m)", "Experimental Acceleration (m/s²)"];
        const secondTableValues = [q_m3ps, velocity, accelerationTheoritcal, torque, acceleration_experimental];
      
        let csvContent = "data:text/csv;charset=utf-8,";
      
        // Add First Table Headers and Values
        csvContent += firstTableHeaders.join(",") + "\n";
        csvContent += firstTableValues.join(",") + "\n\n";
      
        // Add Second Table Headers and Values
        csvContent += secondTableHeaders.join(",") + "\n";
        csvContent += secondTableValues.join(",") + "\n";
      
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "results_data.csv");
        document.body.appendChild(link);
      
        link.click();
        document.body.removeChild(link);
      }
      
      
      

// Get the modal and the close button
const modal = document.getElementById('resultsModal');
const closeResultsModal = document.getElementById('closeResultsModal');

// Close the modal when the "x" button is clicked
closeResultsModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


// Function to display the formulae modal
function showFormulaeModal() {
    const modal = document.getElementById('formulaeModal');
    const formulaeList = document.getElementById('formulaeList');
    
    // List of provided formulae
    const formulae = [
        "1. <strong>Theoretical Acceleration of Coriolis Component</strong> (A<sub>coriolis</sub>)<br>" +
        "   <em>Formula:</em> A<sub>coriolis</sub> = 2 × v × ω<br>" +
        "   <em>Where:</em><br>" +
        "   - A<sub>coriolis</sub> = Coriolis acceleration (m/s²)<br>" +
        "   - v = Velocity of water through the tubes (m/s)<br>" +
        "   - ω = Angular velocity of the system (rad/s)",
      
        "2. <strong>Experimental Coriolis Acceleration</strong> (A<sub>coriolis,exp</sub>)<br>" +
        "   <em>Formula:</em> A<sub>coriolis,exp</sub> = (2 × g × T) / (ρ × a × L²)<br>" +
        "   <em>Where:</em><br>" +
        "   - A<sub>coriolis,exp</sub> = Experimental Coriolis acceleration (m/s²)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - T = Torque applied to rotating arms (N·m)<br>" +
        "   - ρ = Density of water (kg/m³)<br>" +
        "   - a = Cross-sectional area of the tube (m²)<br>" +
        "   - L = Length of the rotating arms (m)",
      
        "3. <strong>Angular Velocity of the System</strong> (ω)<br>" +
        "   <em>Formula:</em> ω = 2 × π × N<br>" +
        "   <em>Where:</em><br>" +
        "   - ω = Angular velocity (rad/s)<br>" +
        "   - π = 3.1416 (constant)<br>" +
        "   - N = Rotational speed (revolutions per second)",
      
        "4. <strong>Torque Applied to Rotating Arms</strong> (T)<br>" +
        "   <em>Formula:</em> T = ΔF × l<br>" +
        "   <em>Where:</em><br>" +
        "   - T = Torque (N·m)<br>" +
        "   - ΔF = Spring balance difference (N)<br>" +
        "   - l = Length of the arm (m)",
      
        "5. <strong>Flow Rate</strong> (Q)<br>" +
        "   <em>Formula:</em> Q = LPH / (3.6 × 10⁶)<br>" +
        "   <em>Where:</em><br>" +
        "   - Q = Flow rate (m³/s)<br>" +
        "   - LPH = Liters per hour (L/h)",
      
        "6. <strong>Velocity of Water Through Tubes</strong> (v)<br>" +
        "   <em>Formula:</em> v = Q / a<br>" +
        "   <em>Where:</em><br>" +
        "   - v = Velocity of water (m/s)<br>" +
        "   - Q = Flow rate (m³/s)<br>" +
        "   - a = Cross-sectional area of the tube (m²)"
      ];
      
  
    // Generate HTML for the formulae
    formulaeList.innerHTML = formulae.map(f => `<li>${f}</li>`).join('');
  
    // Show the modal
    modal.style.display = 'block';
  }
  
  // Close the formulae modal when the close button is clicked
  document.getElementById('closeFormulaeModal').onclick = function() {
    document.getElementById('formulaeModal').style.display = 'none';
  }
  
  // Close the modal if the user clicks outside of it
  window.onclick = function(event) {
    const formulaeModal = document.getElementById('formulaeModal');
    if (event.target === formulaeModal) {
      formulaeModal.style.display = 'none';
    }
  }
  
  

    
    


    const giveAlert=()=>{
        window.alert('Lock the values');
    }

  
    var startTime = 0
    var previousTime = 0;
    var elapsedTime = 0
    var animationFrameId

    var chance = 1

    const updateSimulation = (time)=>{
        
        if (chance%10 == 0){
            springBalance_reading =  ((Math.random()*(0.4-0.1))+0.1).toFixed(3) // random values
            rotameter_reading = Math.floor(Math.random()*150)  // random values
        }
        chance += 1;
       

        draw_animate()
        
        if (time>=10){
            console.log("Done");
            showFinalResults_cor();
            stopAnimation_cor()
        }


        
    }

    const animate_cor = (timestamp)=>{
        previousTime = timestamp
        const currentTime = (performance.now() - startTime)/1000;

        if (isAnimating){
            updateSimulation(currentTime);
            animationFrameId = requestAnimationFrame(animate_cor)
        }


    }

    const startAnimation_cor = ()=>{
        if (!lockButton.checked){
            giveAlert();
            return
        }

        getElement('update_cor').innerText = 'Simulation in progress...'

        if (!isAnimating){
            startTime = performance.now() - elapsedTime *1000;
            previousTime = 0;
            isAnimating = true;
            animationFrameId = requestAnimationFrame(animate_cor)

        }



    }

    const stopAnimation_cor=()=>{
        if (isAnimating) {
            isAnimating = false;
            cancelAnimationFrame(animationFrameId);
            const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
            elapsedTime = currentTime; // Save elapsed time
        }
        getElement('update_cor').innerText = 'Start the simulation by pressing start.'

    }
   

    const resetAnimation_cor = () =>{

        if (isAnimating){
            isAnimating = false;
            cancelAnimationFrame(animationFrameId)
            const currentTime = (performance.now() - startTime)/1000
            elapsedTime = currentTime
        }

        q_input.hidden =false;
        rpm_input.hidden = false;
        diameter_input.hidden = false;

        getElement('showResultsButton').hidden = true;


        rpm_input.value = 40
        q_input.value = 500
        diameter_input.value = 8

        getElement('rpm_value').innerText = 40
        getElement('q_value').innerText = 500;
        getElement('diameter_value').innerText = 8
        getElement('lock_cor').disabled = false;




       


        period = 2000
        velocity = 1
        rpm = 40
        rotameter_reading = 0
        D = 8
        Q = 500
        
        springBalance_reading = ((Math.random()*(0.4-0.1))+0.1).toFixed(3)

      

        getElement("cor_theoretical").innerText = `Theoretical Acc. Coriolis: ${0} m/s²`
        getElement("velocity_theoretical").innerText = 'Velocity: 0 m/s'

 


        startTime = 0
        previousTime = 0
        elapsedTime = 0
        chance = 1

        getElement('update_cor').innerText = 'Start the simulation by pressing start.'

        lockButton.checked = false;

        draw_animate()
       







    }
    

    
startButton.addEventListener("click", startAnimation_cor)
pauseButton.addEventListener("click", stopAnimation_cor)
resetButton.addEventListener("click", resetAnimation_cor)





