public class BusStop {
	private double[] position;
	private Bus upcomingBus;
	private int stopId;

	public BusStop(double[] position, int stopId, Bus upcomingBus) 
	{
		this.position = position;
		this.stopId = stopId;
		this.upcomingBus = upcomingBus;
	}

	public double[] getPosition() 
	{
		return position;
	}

	public Bus getUpcomingBus()
	{
		return upcomingBus;
	}
}