const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function putSelectedQuestion(
  questions: number[],
  id: number,
  isAmbiguous: boolean,
) {
  try {
    await fetch(
      `${API_BASE_URL}/api/users/${id}/selectedQuestions?ambiguous=${isAmbiguous}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selected_questions: questions }),
      },
    );
  } catch (error) {
    alert("Error updating selected questions, please resubmit");
  }
}

export async function deleteSelectedQuestion(
  id: number,
  index: number,
  isAmbiguous: boolean,
) {
  try {
    console.log("Deleting question", index);
    const request = await fetch(
      `${API_BASE_URL}/api/users/${id}/discardQuestions?ambiguous=${isAmbiguous}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Add Content-Type header
        },
        body: JSON.stringify({ index: index }),
      },
    );
    const response = await request.json();
    console.log("Response:", response);
  } catch (error) {
    alert("Error deleting selected questions, please resubmit");
  }
}

export async function putQuestion(
  id: number,
  index: number,
  question: string,
  isAmbiguous: boolean,
) {
  try {
    await fetch(
      `${API_BASE_URL}/api/users/${id}/modifyQuestion?ambiguous=${isAmbiguous}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index, question }),
      },
    );
  } catch (error) {
    alert("Error updating questions, please resubmit");
  }
}
