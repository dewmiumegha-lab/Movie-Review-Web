import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBsc1q1tlBz_cVOVgV9O1hA9n3OhpsN0A8",
  authDomain: "movies-app-c9c0b.firebaseapp.com",
  projectId: "movies-app-c9c0b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const movieRef = collection(db, "movies");


window.addMovie = async function() {
  let name = document.getElementById("name").value;
  let rating = parseInt(document.getElementById("rating").value);
  let director = document.getElementById("director").value;
  let date = document.getElementById("date").value;

  if (!name || !director || !date || rating < 0 || rating > 5) {
    alert("Fill all fields correctly!");
    return;
  }

  try {
    await addDoc(movieRef, { name, rating, director, date });
    
    document.getElementById("name").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("director").value = "";
    document.getElementById("date").value = "";
    
    loadMovies();
  } catch (error) {
    console.error("Error adding movie: ", error);
  }
};


async function loadMovies(sortField = "name") {
  const list = document.getElementById("list");
  list.innerHTML = "<p style='color: #ffd700;'>Loading movies...</p>";

  try {
    const q = query(movieRef, orderBy(sortField));
    const snapshot = await getDocs(q);
    list.innerHTML = "";

    snapshot.forEach(docSnap => {
      let data = docSnap.data();
      let li = document.createElement("li");

      li.innerHTML = `
        <div class="movie-info">
          <b>${data.name}</b>
          <span>Rating: ${data.rating}/5 | Director: ${data.director} | Date: ${data.date}</span>
        </div>
        <div class="actions">
          <button onclick="editMovie('${docSnap.id}')">Edit</button>
          <button style="background-color: #333;" onclick="deleteMovie('${docSnap.id}')">Delete</button>
        </div>
      `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading movies: ", error);
    list.innerHTML = "<p style='color: red;'>Error loading list.</p>";
  }
}

window.deleteMovie = async function(id) {
  if (confirm("Are you sure you want to delete this review?")) {
    await deleteDoc(doc(db, "movies", id));
    loadMovies();
  }
};


window.editMovie = async function(id) {
  let newName = prompt("New movie name:");
  let newRating = parseInt(prompt("New rating (0-5):"));

  if (!newName || isNaN(newRating) || newRating < 0 || newRating > 5) {
    alert("Invalid input!");
    return;
  }

  await updateDoc(doc(db, "movies", id), {
    name: newName,
    rating: newRating
  });

  loadMovies();
};

// 📊 Sort Movies
window.sortMovies = function(field) {
  loadMovies(field);
};

loadMovies();