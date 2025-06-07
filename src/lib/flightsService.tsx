const API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY!;
const API_HOST = process.env.NEXT_PUBLIC_AVIATIONSTACK_HOST!;

export async function getRecentFlights() {

  const url = `https://${API_HOST}/v1/flights?access_key=${API_KEY}&limit=10/`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error('Error to search for flights');
  }

  const data = await response.json();
  return data.data;
}