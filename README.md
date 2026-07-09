# Heart Compass Psychotherapy — kod strony

Zwykły HTML/CSS/JS — bez frameworków, bez kroku budowania (build). Otwierasz `index.html` i to jest cała strona.

```
site/
├── index.html
├── css/style.css
├── js/main.js
├── images/
│   ├── logo.png
│   ├── hero.jpg
│   └── meet.jpg
└── README.md   (ten plik)
```

## 1. Podłącz formularz do własnego Supabase

1. Załóż darmowe konto na [supabase.com](https://supabase.com) i utwórz nowy projekt (wybierz region Europe, jeśli klienci są w Polsce/UE).
2. W panelu projektu wejdź w **SQL Editor** i wklej poniższy kod, żeby stworzyć tabelę na zgłoszenia:

```sql
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  enquiry_reason text,
  first_name text,
  surname text,
  phone text,
  email text,
  preferred_contact text,
  additional_info text
);

-- Włącz Row Level Security
alter table contact_submissions enable row level security;

-- Pozwól KAŻDEMU (odwiedzającym stronę) tylko WYSYŁAĆ nowe zgłoszenia,
-- ale nikomu z zewnątrz nie pozwól ich odczytywać
create policy "Allow public insert"
on contact_submissions
for insert
to anon
with check (true);
```

   Dzięki temu formularz może zapisywać dane, ale nikt niepowołany nie odczyta zgłoszeń bez zalogowania się do panelu Supabase jako administrator (Ty).

3. Wejdź w **Project Settings → API** i skopiuj:
   - **Project URL**
   - **anon public key**
4. Otwórz plik `js/main.js` i na samej górze wklej te dwie wartości:

```js
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "twoj-dlugi-klucz-anon";
```

5. Otwórz `index.html` lokalnie w przeglądarce, wypełnij formularz testowo i sprawdź w Supabase (**Table Editor → contact_submissions**), czy zgłoszenie się pojawiło.

## 2. Sprawdzanie zgłoszeń

Zaloguj się na [supabase.com](https://supabase.com) → Twój projekt → **Table Editor** → `contact_submissions`. Widzisz wszystkie zgłoszenia jak w arkuszu kalkulacyjnym, posortowane po dacie.

## 3. Wdrożenie (GitHub + Netlify)

1. Załóż repozytorium na GitHub i wypchnij ten folder:
   ```
   git init
   git add .
   git commit -m "Pierwsza wersja strony"
   git branch -M main
   git remote add origin [adres-twojego-repo]
   git push -u origin main
   ```
2. Na [netlify.com](https://netlify.com) → **Add new site → Import an existing project → GitHub** → wskaż repozytorium.
3. Ponieważ to zwykły statyczny HTML (bez build stepu), w polach "Build command" zostaw puste, a "Publish directory" ustaw na `.` (kropka — czyli katalog główny).
4. Kliknij **Deploy site**.

## 4. Własna domena

**Site settings → Domain management → Add a domain**, wpisz kupioną domenę i wklej rekordy DNS wskazane przez Netlify u swojego rejestratora domeny. SSL (https) Netlify wygeneruje automatycznie.

## 5. Dalsza edycja

- **Tekst:** edytuj bezpośrednio w `index.html`.
- **Zdjęcia:** podmień pliki w `images/` zachowując te same nazwy (`hero.jpg`, `meet.jpg`, `logo.png`) — albo zmień nazwę pliku i zaktualizuj ścieżkę w `index.html`.
- **Kolory / fonty:** wszystkie zmienne kolorów są zebrane na górze pliku `css/style.css` w sekcji `:root` — zmiana jednej wartości tam zmienia kolor w całej witrynie.
- Po zmianach: `git add . && git commit -m "opis zmiany" && git push` — Netlify wdroży nową wersję automatycznie.
