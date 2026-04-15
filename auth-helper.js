// Auth Helper - Gestione persistenza login e sessioni

// Funzione per ripristinare sessione da localStorage
function restoreSessionFromStorage() {
  const isAuthenticated = localStorage.getItem('bp_authenticated');
  
  if (isAuthenticated === 'true') {
    // Ripristina i dati da localStorage a sessionStorage
    sessionStorage.setItem('authenticated', 'true');
    sessionStorage.setItem('role', localStorage.getItem('bp_role') || 'user');
    sessionStorage.setItem('username', localStorage.getItem('bp_username') || 'Studente');
    sessionStorage.setItem('email', localStorage.getItem('bp_email') || 'user@brainplaying.it');
    sessionStorage.setItem('profileImage', localStorage.getItem('bp_profileImage') || '');
    
    return true;
  }
  return false;
}

// Funzione per salvare sessione in localStorage
function saveSessionToStorage() {
  const authenticated = sessionStorage.getItem('authenticated');
  if (authenticated === 'true') {
    localStorage.setItem('bp_authenticated', 'true');
    localStorage.setItem('bp_role', sessionStorage.getItem('role') || 'user');
    localStorage.setItem('bp_username', sessionStorage.getItem('username') || 'Studente');
    localStorage.setItem('bp_email', sessionStorage.getItem('email') || 'user@brainplaying.it');
    localStorage.setItem('bp_profileImage', sessionStorage.getItem('profileImage') || '');
  }
}

// Funzione per cancellare sessione persistente
function clearPersistentSession() {
  localStorage.removeItem('bp_authenticated');
  localStorage.removeItem('bp_role');
  localStorage.removeItem('bp_username');
  localStorage.removeItem('bp_email');
  localStorage.removeItem('bp_profileImage');
}

// Funzione per verificare autenticazione con ripristino automatico
function checkAuthentication() {
  const sessionAuth = sessionStorage.getItem('authenticated');
  
  if (sessionAuth === 'true') {
    return true;
  }
  
  // Prova a ripristinare da localStorage
  return restoreSessionFromStorage();
}

// Funzione per logout completo
function logout() {
  sessionStorage.clear();
  clearPersistentSession();
  window.location.href = 'index.html';
}
