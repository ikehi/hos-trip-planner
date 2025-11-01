# HOS Trip Planner - Professional FMCSA Compliance Tool

A full-stack application for property-carrying drivers to plan trips while ensuring Hours of Service (HOS) compliance with automatic break calculations, route planning, and ELD log generation.

## 🚀 Features

✅ **FMCSA Compliant**: Follows 70hr/8day rules, 11hr driving limits, 14hr windows
✅ **Automatic Breaks**: Intelligently calculates 30-min and 10-hr required breaks
✅ **Route Planning**: Free OSRM & Nominatim APIs for accurate distance/time
✅ **ELD Log Sheets**: Generated daily logs drawn on official FMCSA templates
✅ **Beautiful UI**: Modern, responsive design with Tailwind CSS

## 🛠️ Tech Stack

**Backend**: Django + DRF, Pillow for image generation, Free map APIs  
**Frontend**: React + TypeScript, Vite, Tailwind CSS, Leaflet maps  
**Deployment**: Vercel (frontend) + Render (backend)

## 📦 Quick Start

### Backend
\`\`\`bash
cd backend
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🎯 How It Works

1. Enter trip details: Current, Pickup, Dropoff locations + cycle hours used
2. System calculates route via free OSRM API
3. HOS solver simulates trip with mandatory breaks (fuel stops every 1000mi)
4. Generates ELD log images with drawn status lines
5. Returns interactive map + daily log sheets

## 📝 Assumptions

- Property-carrying drivers (not passenger)
- 70hrs/8days cycle
- No adverse driving conditions
- Fuel stops every 1,000 miles
- 1 hour for pickup/dropoff activities

## 🌐 Live Demo

Deployed on Vercel (frontend) + Render (backend)  
*Live links added after deployment*

## 📄 License

MIT License

---

Built for FMCSA HOS compliance planning. Professional grade. 💰\$150
