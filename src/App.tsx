import { useState, useEffect } from 'react'
import './App.css'
import SevenSegmentDigit from './SevenSegmentDigit'

function App() {
  const [teamAName, setTeamAName] = useState('Team A')
  const [teamBName, setTeamBName] = useState('Team B')
  const [scoreTeamA, setScoreTeamA] = useState(0)
  const [scoreTeamB, setScoreTeamB] = useState(0)
  const [quarter, setQuarter] = useState(1)
  const [shotClock, setShotClock] = useState(28)
  const [manualShotClockInput, setManualShotClockInput] = useState('28')
  const [manualShotClockError, setManualShotClockError] = useState('')
  const [showManualShotClockEditor, setShowManualShotClockEditor] = useState(false)
  const [manualTimeInput, setManualTimeInput] = useState('08:00')
  const [manualTimeError, setManualTimeError] = useState('')
  const [showManualTimeEditor, setShowManualTimeEditor] = useState(false)
  const [time, setTime] = useState(480) // 8 minutes in seconds, counting down
  const [isRunning, setIsRunning] = useState(false)

  const playEndSignal = async () => {
    const AudioContextClass =
      window.AudioContext
      || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) {
      return
    }

    const audioContext = new AudioContextClass()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const startTime = audioContext.currentTime
    const durationSeconds = 2.5
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(900, startTime)
    gainNode.gain.setValueAtTime(0.001, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.9, startTime + 0.03)
    gainNode.gain.setValueAtTime(0.9, startTime + durationSeconds - 0.08)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durationSeconds)

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + durationSeconds)

    window.setTimeout(() => {
      void audioContext.close()
    }, Math.ceil((durationSeconds + 0.2) * 1000))
  }

  const playShotClockSignal = async () => {
    const AudioContextClass =
      window.AudioContext
      || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextClass) {
      return
    }

    const audioContext = new AudioContextClass()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const startTime = audioContext.currentTime
    for (let i = 0; i < 4; i += 1) {
      const beepStart = startTime + i * 0.18
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(1200, beepStart)
      gainNode.gain.setValueAtTime(0.001, beepStart)
      gainNode.gain.exponentialRampToValueAtTime(0.55, beepStart + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, beepStart + 0.12)

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.start(beepStart)
      oscillator.stop(beepStart + 0.12)
    }

    window.setTimeout(() => {
      void audioContext.close()
    }, 1100)
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false)
            void playEndSignal()
            return 0
          }
          return prevTime - 1
        })
        setShotClock((prevShotClock) => {
          if (prevShotClock === 1) {
            void playShotClockSignal()
            return 0
          }
          return prevShotClock > 0 ? prevShotClock - 1 : 0
        })
      }, 1000)
    } else if (!isRunning) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time])

  const applyManualTime = () => {
    const match = manualTimeInput.trim().match(/^(\d{1,2}):([0-5]\d)$/)
    if (!match) {
      setManualTimeError('Bitte Format MM:SS verwenden')
      return
    }

    const mins = Number(match[1])
    const secs = Number(match[2])
    const totalSeconds = mins * 60 + secs
    setTime(totalSeconds)
    setManualTimeInput(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    setManualTimeError('')
  }

  const applyManualShotClock = () => {
    const value = manualShotClockInput.trim()
    if (!/^\d{1,2}$/.test(value)) {
      setManualShotClockError('Bitte Wert 0 bis 99 eingeben')
      return
    }

    const seconds = Number(value)
    if (seconds < 0 || seconds > 99) {
      setManualShotClockError('Bitte Wert 0 bis 99 eingeben')
      return
    }

    setShotClock(seconds)
    setManualShotClockInput(seconds.toString().padStart(2, '0'))
    setManualShotClockError('')
  }

  const resetGame = () => {
    setScoreTeamA(0)
    setScoreTeamB(0)
    setQuarter(1)
    setShotClock(28)
    setManualShotClockInput('28')
    setManualShotClockError('')
    setShowManualShotClockEditor(false)
    setTime(480)
    setManualTimeInput('08:00')
    setManualTimeError('')
    setShowManualTimeEditor(false)
    setIsRunning(false)
  }

  const resetShotClock = () => {
    setShotClock(28)
    setManualShotClockInput('28')
    setManualShotClockError('')
  }

  const resetShotClockTo18 = () => {
    setShotClock(18)
    setManualShotClockInput('18')
    setManualShotClockError('')
  }

  return (
    <div className="scoreboard">
      <div className="quarter-panel">
        <div className="quarter-label">Viertel</div>
        <div className="quarter-display">
          <SevenSegmentDigit digit={quarter} className="score-digit" />
        </div>
        <div className="quarter-buttons">
          <button onClick={() => setQuarter((prev) => Math.min(4, prev + 1))}>+</button>
          <button onClick={() => setQuarter((prev) => Math.max(1, prev - 1))}>-</button>
        </div>
      </div>
      <div className="shot-clock-panel">
        <div className="shot-clock-label">Angriffszeit</div>
        <div className="shot-clock-display-wrapper">
          <div className="shot-clock-display">
            <SevenSegmentDigit digit={Math.floor(shotClock / 10)} className="score-digit" />
            <SevenSegmentDigit digit={shotClock % 10} className="score-digit" />
          </div>
          <button
            className="shot-clock-manual-toggle"
            onClick={() => setShowManualShotClockEditor((prev) => !prev)}
            aria-label="Manuelle Angriffszeit ein- oder ausblenden"
            title="Manuelle Angriffszeit ein- oder ausblenden"
          >
            ✎
          </button>
        </div>
        <div className="shot-clock-buttons">
          <button onClick={resetShotClock}>Reset 28</button>
          <button onClick={resetShotClockTo18}>Reset 18</button>
        </div>
        {showManualShotClockEditor ? (
          <div className="shot-clock-manual">
            <label htmlFor="manual-shot-clock" className="shot-clock-manual-label">Angriffszeit (SS)</label>
            <div className="shot-clock-manual-controls">
              <input
                id="manual-shot-clock"
                type="text"
                value={manualShotClockInput}
                onChange={(e) => setManualShotClockInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyManualShotClock()
                  }
                }}
                className="shot-clock-manual-input"
                placeholder="28"
              />
              <button onClick={applyManualShotClock}>Uebernehmen</button>
            </div>
            {manualShotClockError ? <div className="shot-clock-manual-error">{manualShotClockError}</div> : null}
          </div>
        ) : null}
      </div>
      <div className="header">
        <h1>Waterpolo Scoreboard</h1>
        <div className="matchup">
          <input
            type="text"
            value={teamAName}
            onChange={(e) => setTeamAName(e.target.value)}
            className="team-name-input"
            placeholder="Team A"
          />
          <span className="vs">vs</span>
          <input
            type="text"
            value={teamBName}
            onChange={(e) => setTeamBName(e.target.value)}
            className="team-name-input"
            placeholder="Team B"
          />
        </div>
      </div>
      <div className="timer">
        <div className="timer-main">
          <div className="time-display-wrapper">
            <div className="seven-segment-display">
              <SevenSegmentDigit digit={Math.floor(time / 600)} />
              <SevenSegmentDigit digit={Math.floor((time / 60) % 10)} />
              <div className="colon" aria-hidden="true">
                <span className="colon-dot"></span>
                <span className="colon-dot"></span>
              </div>
              <SevenSegmentDigit digit={Math.floor((time % 60) / 10)} />
              <SevenSegmentDigit digit={time % 10} />
            </div>
            <button
              className="timer-manual-toggle"
              onClick={() => setShowManualTimeEditor((prev) => !prev)}
              aria-label="Manuelle Zeit ein- oder ausblenden"
              title="Manuelle Zeit ein- oder ausblenden"
            >
              ✎
            </button>
          </div>
          <div className="timer-buttons">
            <button onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Stop' : 'Start'}
            </button>
            <button onClick={resetGame}>Reset</button>
          </div>
        </div>
        {showManualTimeEditor ? (
          <div className="timer-manual">
            <label htmlFor="manual-time" className="timer-manual-label">Spielzeit (MM:SS)</label>
            <div className="timer-manual-controls">
              <input
                id="manual-time"
                type="text"
                value={manualTimeInput}
                onChange={(e) => setManualTimeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyManualTime()
                  }
                }}
                className="timer-manual-input"
                placeholder="08:00"
              />
              <button onClick={applyManualTime}>Uebernehmen</button>
            </div>
            {manualTimeError ? <div className="timer-manual-error">{manualTimeError}</div> : null}
          </div>
        ) : null}
      </div>
      <div className="teams">
        <div className="team">
          <h3>{teamAName}</h3>
          <div className="score-display">
            <div className="score">
              <SevenSegmentDigit digit={Math.floor(scoreTeamA / 10)} className="score-digit" />
              <SevenSegmentDigit digit={scoreTeamA % 10} className="score-digit" />
            </div>
            <div className="score-buttons">
              <button onClick={() => setScoreTeamA(scoreTeamA + 1)}>+</button>
              <button onClick={() => setScoreTeamA(Math.max(0, scoreTeamA - 1))}>-</button>
            </div>
          </div>
        </div>
        <div className="team">
          <h3>{teamBName}</h3>
          <div className="score-display">
            <div className="score">
              <SevenSegmentDigit digit={Math.floor(scoreTeamB / 10)} className="score-digit" />
              <SevenSegmentDigit digit={scoreTeamB % 10} className="score-digit" />
            </div>
            <div className="score-buttons">
              <button onClick={() => setScoreTeamB(scoreTeamB + 1)}>+</button>
              <button onClick={() => setScoreTeamB(Math.max(0, scoreTeamB - 1))}>-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
