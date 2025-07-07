import { useEffect, useState } from "react"
import API from "../api/api"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const [dsa, setDsa] = useState(null)
  const [core, setCore] = useState(null)
  const [theory, setTheory] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (!userId) {
      navigate("/login")
      return
    }

    const fetchData = async () => {
      try {
        const [dsaRes, coreRes, theoryRes, quizRes] = await Promise.all([
          API.get(`/dsa/progress/${userId}`),
          API.get(`/core/progress/${userId}`),
          API.get(`/theory/progress/${userId}`),
          API.get(`/quiz/history?limit=5`),
        ])
        setDsa(dsaRes.data)
        setCore(coreRes.data)
        setTheory(theoryRes.data)
        setQuizzes(quizRes.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">DSA Progress</h2>
        <p>Solved: {dsa?.solved || 0} / {dsa?.total || 0}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Core Subjects</h2>
        <p>Completed: {core?.completed || 0} / {core?.total || 0}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Theory</h2>
        <p>Completed: {theory?.completed || 0} / {theory?.total || 0}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Recent Quizzes</h2>
        {!Array.isArray(quizzes) || quizzes.length === 0 ? (
          <p>No quizzes attempted yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {quizzes.map((q, index) => (
              <li key={index}>
                {q.subject} - Score: {q.score}/{q.total} ({new Date(q.takenAt).toLocaleDateString()})
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}

export default Dashboard
