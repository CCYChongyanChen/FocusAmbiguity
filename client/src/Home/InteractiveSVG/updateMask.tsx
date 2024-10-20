export async function putSelectedParts(masks: number[], id: number) {
  try {
    await fetch(`http://localhost:4000/api/users/${id}/selectedParts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_parts_polygons: masks }),
    });
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function putSelectedObject(masks: number[], id: number) {
  try {
    await fetch(`http://localhost:4000/api/users/${id}/selectedObjects`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selected_objects_polygons: masks }),
    });
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}