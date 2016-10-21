public class Bus {
	
	private int busId;
	private BusStop currentStop;
	private BusStop[] nextStops;
	private int routeId;
	private double[] position;
	private int schedule;

	public Bus(int busId, BusStop currentStop, BusStop[] nextStops, int routeId, double[] position, int schedule) {
		this.busId = busId;
		this.currentStop = currentStop;
		this.nextStops = nextStops;
		this.routeId = routeId;
		this.position = position;
		this.schedule = schedule;
	}

	public double[] getPosition()
	{
		return position;
	}

	public BusStop getCurrentStop()
	{
		return currentStop;
	}

	public BusStop[] getNextStops()
	{
		return nextStops;
	}

	public int getRouteId()
	{
		return routeId;
	}

	public int getSchedule()
	{
		return schedule;
	}
}