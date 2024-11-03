const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export async function putSelectedParts(
  masks: number[],
  id: number,
  isAmbiguous: boolean,
) {
  try {
    await fetch(
      `${API_BASE_URL}/api/users/${id}/selectedParts?ambiguous=${isAmbiguous}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_parts_polygons: masks }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function putSelectedObject(
  masks: number[],
  id: number,
  isAmbiguous: boolean,
) {
  try {
    await fetch(
      `${API_BASE_URL}/api/users/${id}/selectedObjects?ambiguous=${isAmbiguous}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_objects_polygons: masks }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}
