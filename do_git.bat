@echo off
chcp 65001 >nul
c:
cd \program1\gymtest

git add .gitignore
git add index.html
git add style.css
git add script.js
git add README.md
git add assets/hero-person.png
git add assets/icon-dumbbell.png
git add assets/program-metod.png
git add assets/program-popa-1.png
git add assets/program-popa-2.png
git add assets/program-stroynosti.png
git add assets/program-zhiro.png
git add assets/program-zhivot.png
git add assets/trust-person.png

git commit -m "3 экрана фитнес-лендинга: hero, блок доверия, каталог программ"

git remote remove origin
git remote add origin https://github.com/Callme-A/usmanova-fit-landing.git
git branch -M main
git push -u origin main

echo === ЗАГРУЗКА ЗАВЕРШЕНА ===