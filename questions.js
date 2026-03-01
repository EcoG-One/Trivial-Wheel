// Questions bank
const allQuestions = {
    'Geography': [
        { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
        { q: "Which river is the longest in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
        { q: "Mount Everest is located in which mountain range?", options: ["Alps", "Andes", "Himalayas", "Rockies"], correct: 2 },
        { q: "Which country has the most natural lakes?", options: ["USA", "Russia", "Canada", "Brazil"], correct: 2 },
        { q: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correct: 1 },
        { q: "Which desert is the largest in the world?", options: ["Sahara", "Gobi", "Antarctic", "Arabian"], correct: 2 },
        { q: "What is the capital of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2 },
        { q: "Which ocean is the deepest?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
        { q: "In which country would you find the Great Barrier Reef?", options: ["Indonesia", "Philippines", "Australia", "Thailand"], correct: 2 },
        { q: "What is the largest island in the world?", options: ["Borneo", "Madagascar", "Greenland", "New Guinea"], correct: 2 }
    ],
    'Entertainment': [
        { q: "Who directed 'Jurassic Park'?", options: ["James Cameron", "Steven Spielberg", "George Lucas", "Ridley Scott"], correct: 1 },
        { q: "Which band performed 'Bohemian Rhapsody'?", options: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"], correct: 2 },
        { q: "What year was the first Harry Potter movie released?", options: ["1999", "2000", "2001", "2002"], correct: 2 },
        { q: "Who played Jack in 'Titanic'?", options: ["Brad Pitt", "Leonardo DiCaprio", "Tom Cruise", "Johnny Depp"], correct: 1 },
        { q: "Which TV show features a character named Walter White?", options: ["The Wire", "Breaking Bad", "Better Call Saul", "Ozark"], correct: 1 },
        { q: "What is the name of Batman's butler?", options: ["Alfred", "Jarvis", "Geoffrey", "Winston"], correct: 0 },
        { q: "Which artist sang 'Thriller'?", options: ["Prince", "Michael Jackson", "Whitney Houston", "Stevie Wonder"], correct: 1 },
        { q: "In 'The Lion King', what is Simba's father's name?", options: ["Scar", "Mufasa", "Rafiki", "Zazu"], correct: 1 },
        { q: "Which movie won Best Picture at the 2020 Oscars?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], correct: 2 },
        { q: "What instrument does Sherlock Holmes play?", options: ["Piano", "Violin", "Cello", "Flute"], correct: 1 }
    ],
    'History': [
        { q: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
        { q: "Who was the first President of the United States?", options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"], correct: 2 },
        { q: "The Great Wall of China was primarily built to defend against which group?", options: ["Japanese", "Mongols", "Koreans", "Vietnamese"], correct: 1 },
        { q: "In which year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], correct: 1 },
        { q: "Who was the Egyptian queen famous for her beauty?", options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Isis"], correct: 1 },
        { q: "The French Revolution began in which year?", options: ["1776", "1789", "1799", "1804"], correct: 1 },
        { q: "Who discovered America in 1492?", options: ["Amerigo Vespucci", "Christopher Columbus", "Leif Erikson", "Ferdinand Magellan"], correct: 1 },
        { q: "The Renaissance began in which country?", options: ["France", "Spain", "Italy", "England"], correct: 2 },
        { q: "Who was the first man to walk on the moon?", options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Yuri Gagarin"], correct: 1 },
        { q: "The Berlin Wall fell in which year?", options: ["1987", "1988", "1989", "1990"], correct: 2 }
    ],
    'Art & Literature': [
        { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], correct: 1 },
        { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Botticelli"], correct: 2 },
        { q: "What is the name of the famous painting by Edvard Munch?", options: ["The Scream", "Starry Night", "The Kiss", "Girl with Pearl Earring"], correct: 0 },
        { q: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], correct: 1 },
        { q: "Which artist cut off part of his own ear?", options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Salvador Dalí"], correct: 2 },
        { q: "Who wrote 'Pride and Prejudice'?", options: ["Charlotte Brontë", "Emily Brontë", "Jane Austen", "Mary Shelley"], correct: 2 },
        { q: "The Sistine Chapel ceiling was painted by whom?", options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 1 },
        { q: "Who wrote 'The Great Gatsby'?", options: ["Ernest Hemingway", "F. Scott Fitzgerald", "John Steinbeck", "William Faulkner"], correct: 1 },
        { q: "Which art movement is Salvador Dalí associated with?", options: ["Impressionism", "Cubism", "Surrealism", "Pop Art"], correct: 2 },
        { q: "Who wrote 'Don Quixote'?", options: ["Miguel de Cervantes", "Gabriel García Márquez", "Jorge Luis Borges", "Pablo Neruda"], correct: 0 }
    ],
    'Science & Nature': [
        { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
        { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], correct: 1 },
        { q: "What is the largest mammal on Earth?", options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"], correct: 1 },
        { q: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
        { q: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
        { q: "How many bones are in the adult human body?", options: ["196", "206", "216", "226"], correct: 1 },
        { q: "What is the speed of light approximately?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correct: 0 },
        { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { q: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Heart"], correct: 2 },
        { q: "What element does 'O' represent on the periodic table?", options: ["Osmium", "Oxygen", "Oganesson", "Oxide"], correct: 1 }
    ],
    'Sports & Leisure': [
        { q: "How many players are on a soccer team on the field?", options: ["9", "10", "11", "12"], correct: 2 },
        { q: "In which sport would you perform a slam dunk?", options: ["Volleyball", "Basketball", "Tennis", "Hockey"], correct: 1 },
        { q: "The Olympics are held every how many years?", options: ["2", "3", "4", "5"], correct: 2 },
        { q: "What sport is played at Wimbledon?", options: ["Golf", "Cricket", "Tennis", "Rugby"], correct: 2 },
        { q: "How many holes are there in a standard round of golf?", options: ["9", "12", "15", "18"], correct: 3 },
        { q: "In which country did the modern Olympic Games originate?", options: ["Greece", "Italy", "France", "England"], correct: 0 },
        { q: "What is the national sport of Japan?", options: ["Judo", "Karate", "Sumo", "Kendo"], correct: 2 },
        { q: "How many rings are on the Olympic flag?", options: ["4", "5", "6", "7"], correct: 1 },
        { q: "In bowling, what is three strikes in a row called?", options: ["Hat trick", "Turkey", "Triple", "Threepeat"], correct: 1 },
        { q: "Which country has won the most FIFA World Cups?", options: ["Germany", "Argentina", "Brazil", "Italy"], correct: 2 }
    ]
};

