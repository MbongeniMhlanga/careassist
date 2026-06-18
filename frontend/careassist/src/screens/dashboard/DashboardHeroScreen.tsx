export function DashboardHeroScreen() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow">CareAssist</p>
        <h2>See who needs a dose, what it is, and when it is due.</h2>
        <p className="lede">
          Choose a person, review only their medication reminders, and mark a dose complete
          without digging through a crowded list.
        </p>
        <div className="hero-pills">
          <span className="status-chip">People first</span>
          <span className="status-chip">Due today</span>
          <span className="status-chip">Mark taken</span>
        </div>
      </div>
    </header>
  )
}
