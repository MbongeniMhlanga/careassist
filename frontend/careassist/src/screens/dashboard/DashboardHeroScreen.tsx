export function DashboardHeroScreen() {
  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="eyebrow">CareAssist</p>
        <h2>Build reminders for people, not just medicines.</h2>
        <p className="lede">
          Create users, assign family members, add medications, attach reminder times, and mark doses
          as taken from one dashboard.
        </p>
        <div className="hero-pills">
          <span className="status-chip">Families</span>
          <span className="status-chip">Schedules</span>
          <span className="status-chip">Reminders</span>
        </div>
      </div>
      <div className="hero-card">
        <div className="hero-card-top">
          <p>Live sync</p>
          <span className="status-badge sent">Connected</span>
        </div>
        <strong>Connected to CareAssist backend</strong>
        <span className="muted-on-dark">
          React Query keeps the data fresh without the page feeling busy.
        </span>
        <div className="hero-card-footer">
          <span className="hero-pulse">
            <span className="hero-pulse-dot" />
            Refresh every 60s
          </span>
          <span className="hero-card-note">Premium health-tech dashboard</span>
        </div>
      </div>
    </header>
  )
}
