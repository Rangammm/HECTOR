import { useState, useEffect } from 'react'
import { getTripById, getStops, getActivities } from '../lib/api.js'

export function useTrip(tripId) {
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [activities, setActivities] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tripId) return

    async function load() {
      try {
        const tripData = await getTripById(tripId)
        setTrip(tripData)

        const stopsData = await getStops(tripId)
        setStops(stopsData || [])

        const acts = {}
        for (const stop of stopsData || []) {
          const stopActs = await getActivities(stop.id)
          acts[stop.id] = stopActs || []
        }
        setActivities(acts)
      } catch (err) {
        console.error('useTrip error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [tripId])

  return { trip, stops, setStops, activities, setActivities, loading }
}
