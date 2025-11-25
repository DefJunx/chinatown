# Funzionalità di Controllo Registrazione Admin

## Panoramica
Questa funzionalità aggiunge un controllo switch nella dashboard admin per abilitare o disabilitare la rotta per la creazione di nuovi account admin (`/admin/setup`).

## Cosa è Stato Modificato

### 1. Schema Database (`lib/instant.ts`)
- Aggiunta una nuova interfaccia `SystemSettings` con flag `allowAdminRegistration`
- Aggiunto `systemSettings` allo schema InstantDB

### 2. Dashboard Admin (`app/admin/dashboard/page.tsx`)
- Aggiunta una sezione "Impostazioni di Sistema" in cima alla dashboard
- Implementato uno switch per abilitare/disabilitare la registrazione admin
- Le impostazioni sono salvate in InstantDB con ID `system-settings-primary`
- Utilizza notifiche toast per confermare le modifiche
- UI elegante con icona Impostazioni e descrizione chiara

### 3. Pagina Setup Admin (`app/admin/setup/page.tsx`)
- Aggiunto controllo per l'impostazione `allowAdminRegistration`
- Mostra un messaggio user-friendly "Registrazione Disabilitata" quando il flag è disattivato
- Fornisce un pulsante per tornare alla pagina di login
- Per default permette la registrazione se non esistono impostazioni (primo setup)

### 4. Layout Admin (`app/admin/layout.tsx`)
- Aggiunta logica per reindirizzare gli utenti da `/admin/setup` se la registrazione è disabilitata
- Controlla le impostazioni di sistema e applica la restrizione a livello di layout

## Come Funziona

1. **Comportamento Default**: Al primo utilizzo, la registrazione admin è permessa di default (così il primo admin può essere creato)

2. **Controllo Switch**: Una volta che un admin ha effettuato il login, può andare alla dashboard e attivare/disattivare l'impostazione "Permetti Registrazione Admin"

3. **Protezione**: Quando disabilitata:
   - L'accesso diretto a `/admin/setup` è bloccato a livello di layout
   - La pagina setup mostra un messaggio "Registrazione Disabilitata"
   - Gli utenti vengono reindirizzati alla pagina di login

4. **Persistenza**: L'impostazione è memorizzata in InstantDB e persiste tra le sessioni

## Utilizzo

1. Effettua il login come admin
2. Vai alla Dashboard Admin
3. Cerca la sezione "Impostazioni di Sistema" in alto
4. Attiva/disattiva lo switch "Permetti Registrazione Admin"
5. La rotta `/admin/setup` è ora abilitata o disabilitata in base alla tua scelta

## Vantaggi di Sicurezza

- Previene la creazione non autorizzata di account admin dopo il setup iniziale
- Può essere facilmente attivata/disattivata secondo necessità
- Applicata a più livelli (layout e pagina)
- Non è necessario eliminare manualmente rotte o file

## Caratteristiche UI

- Design pulito e moderno dello switch
- Etichettatura chiara con informazioni sulla rotta
- Notifiche toast per feedback
- Stato disabilitato durante il salvataggio
- Accessibile con navigazione da tastiera e anelli di focus


