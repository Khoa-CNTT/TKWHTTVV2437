const apisImage = {
  uploadImageMutiple: async (formData: FormData) => {
    const response = await fetch(
      `${process.env.URL_SERVER_API}/image/upload-multiple`,
      {
        method: "POST",
        body: formData,
      }
    );

    return response.json();
  },
};

export default apisImage;
