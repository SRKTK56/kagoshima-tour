# Viator Travel Tech Challenge — Project Description

## Demo Video
🎬 [Watch on YouTube](https://youtu.be/OckPvBFKu5g)

## What We Built

**Kagoshima AI Travel Concierge** is a deeply personalized travel planning assistant focused on Kagoshima, Japan — a destination rich with active volcanoes, sand-bath onsen, world heritage forests, and Kurobuta pork cuisine. The app addresses a fundamental problem in travel planning: generic recommendations that ignore what travelers actually need. Most travel tools throw options at users without understanding their budget constraints, travel companions, physical pace preference, or whether they have young children who can't participate in high-intensity activities.

Our solution uses a structured "Ask for Question" interview flow — the AI asks seven targeted questions (departure city, travel month, nights, party composition, budget, theme, and pace) and only calls the Viator API after all criteria are collected. This prevents the frustrating experience of being shown a ¥50,000 adventure trek when you're traveling with a 3-year-old on a ¥30,000 budget.

## How We Use Viator's Data Capabilities

We integrate with the Viator Partner API v2 to deliver real-time, filtered tour results for Kagoshima (destination ID: 4663). Beyond basic product search, we leverage Viator's structured filtering to pass `highestPrice` (calculated as remaining budget after transport and accommodation), `durationInMinutes` (mapped from the user's pace preference — "relaxed" caps at 6 hours, "active" starts at 3 hours), and `flags: ["PRIVATE_TOUR"]` for couple and family bookings. Every tour card surfaces the affiliate product URL directly, routing users to Viator's optimized checkout flow. The app also features a live itinerary panel that updates in real-time as the conversation progresses, with each tour spot displaying Viator's product images, ratings, duration, and a one-click booking link.

## Real-World Value & Production Potential

This concierge model is directly applicable to inbound tourism promotion for regional destinations. Kagoshima Prefecture struggles with tourist fragmentation — visitors often miss the island of Yakushima or the sand-bath experience at Ibusuki because they lack a knowledgeable local guide. Our app fills this gap digitally. The child age-based pricing calculator (which correctly applies Japan's half-price rule for ages 6–11 on transport and tours, and free admission for under-3s) is a feature no existing travel tool handles accurately. The admin panel allows local tour operators to register custom experiences that appear alongside Viator's catalog, creating a hybrid discovery platform that benefits both global travelers and local businesses seeking more visibility.
