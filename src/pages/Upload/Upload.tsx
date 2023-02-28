import axios, { AxiosError } from "axios";
import { useEffect, useState, useContext } from "react";
import { DataContext } from "../../context/DataContextProvider";
import jsonData from "../../assets/data.json";
import { useNavigate } from "react-router-dom";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

interface Errors {
  error: boolean;
  errorMessage: string;
}

export default function Upload() {

  const { stravaDataKey, nameKey } = useContext(DataContext);
  const [stravaData, setStravaData] = stravaDataKey;
  const [name, setName] = nameKey;
  const numberOfRuns = 15;
  const navigate = useNavigate();

  const getAuthToken = (windowLocation: string): string => {
    return windowLocation.split("&")[1].slice(5);
  };

  const getAccessTokens = async (authToken: string) => {
    try {
      const response = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${authToken}&grant_type=authorization_code`
      );

      return response.data;
    } catch (error: any) {
      const message = error.message;
      //   setError({ error: true, errorMessage: message });
      console.log("error getAccessTokens", error);
    }
  };

  const getUserData = async (accessToken: string) => {
    const timeNow = new Date().valueOf();
    const before = Number(String(timeNow).substring(0, 10));

    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=1514764800&page=1&per_page=${numberOfRuns}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // console.log(response);
      return response.data;
    } catch (error: any) {
      // const message = error.message;
      //   setError({ error: true, errorMessage: message });
      console.log("error getUserData", error);
    }
  };

  interface DataProps {
    data: any;
  }

  const getBestEffortsAll = async (userData: any[], accessToken: string) => {
    // const array = []
    const endpoints = [];
    for (let i = 0; i < numberOfRuns; i++) {
      endpoints.push(
        `https://www.strava.com/api/v3/activities/${userData[i].id}?include_all_efforts=true`
      );
    }
    try {
      // console.log(endpoints)
      const response: DataProps[] = await axios.all(
        endpoints.map((endpoint) =>
          axios.get(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
        )
      );

      const getTheData = response.map((data) => data.data);

      // console.log("getTheData", getTheData)
      return getTheData;
    } catch (error) {
      console.log("error getbestefforts", error);
    }
  };

  const activate = async () => {
    try {
      const stravaAuthToken: string = getAuthToken(location.search);
      const tokens: any = await getAccessTokens(stravaAuthToken);

      const accessToken: string = await tokens.access_token;
      setName(`${tokens?.athlete.firstname} ${tokens?.athlete.lastname}`);

      const user = await getUserData(accessToken);
      const bestEfforts = await getBestEffortsAll(user, accessToken);
      setStravaData(bestEfforts);
      
    } catch (err) {
      console.log("err activate", err);
    }
  };
  useEffect(() => {
    activate();
  }, []);

  useEffect(() => {
    // stravaData.length > 0 && setLoaded(true);
    stravaData.length > 0 && navigate("/site/dash");
  }, [stravaData]);

  return (
    <div>
      <div className="svg">
        <svg
          width="276"
          height="166"
          viewBox="0 0 276 166"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M113.995 115V104.091H115.971V113.343H120.776V115H113.995ZM125.975 115.16C125.176 115.16 124.483 114.984 123.897 114.632C123.311 114.281 122.857 113.789 122.534 113.157C122.214 112.525 122.054 111.786 122.054 110.941C122.054 110.096 122.214 109.355 122.534 108.72C122.857 108.084 123.311 107.591 123.897 107.239C124.483 106.887 125.176 106.712 125.975 106.712C126.774 106.712 127.466 106.887 128.052 107.239C128.638 107.591 129.091 108.084 129.41 108.72C129.734 109.355 129.895 110.096 129.895 110.941C129.895 111.786 129.734 112.525 129.41 113.157C129.091 113.789 128.638 114.281 128.052 114.632C127.466 114.984 126.774 115.16 125.975 115.16ZM125.985 113.615C126.419 113.615 126.781 113.496 127.072 113.258C127.363 113.017 127.58 112.694 127.722 112.289C127.867 111.884 127.94 111.433 127.94 110.936C127.94 110.435 127.867 109.982 127.722 109.577C127.58 109.169 127.363 108.844 127.072 108.603C126.781 108.361 126.419 108.24 125.985 108.24C125.541 108.24 125.172 108.361 124.877 108.603C124.586 108.844 124.368 109.169 124.222 109.577C124.08 109.982 124.009 110.435 124.009 110.936C124.009 111.433 124.08 111.884 124.222 112.289C124.368 112.694 124.586 113.017 124.877 113.258C125.172 113.496 125.541 113.615 125.985 113.615ZM133.886 115.165C133.368 115.165 132.901 115.073 132.485 114.888C132.073 114.7 131.747 114.423 131.505 114.057C131.267 113.691 131.148 113.24 131.148 112.704C131.148 112.243 131.233 111.861 131.404 111.559C131.574 111.257 131.807 111.016 132.102 110.835C132.396 110.653 132.729 110.517 133.098 110.424C133.471 110.328 133.856 110.259 134.254 110.217C134.733 110.167 135.122 110.123 135.42 110.083C135.719 110.041 135.935 109.977 136.07 109.892C136.209 109.803 136.278 109.666 136.278 109.482V109.45C136.278 109.048 136.159 108.738 135.921 108.517C135.683 108.297 135.34 108.187 134.893 108.187C134.421 108.187 134.046 108.29 133.769 108.496C133.496 108.702 133.311 108.945 133.215 109.226L131.415 108.97C131.557 108.473 131.791 108.058 132.118 107.724C132.444 107.386 132.844 107.134 133.316 106.967C133.789 106.797 134.311 106.712 134.882 106.712C135.276 106.712 135.669 106.758 136.059 106.85C136.45 106.942 136.807 107.095 137.13 107.308C137.453 107.518 137.713 107.804 137.908 108.166C138.107 108.528 138.206 108.981 138.206 109.524V115H136.352V113.876H136.289C136.171 114.103 136.006 114.316 135.793 114.515C135.584 114.711 135.319 114.869 134.999 114.989C134.683 115.107 134.312 115.165 133.886 115.165ZM134.387 113.748C134.774 113.748 135.11 113.672 135.394 113.519C135.678 113.363 135.896 113.157 136.049 112.901C136.205 112.646 136.283 112.367 136.283 112.065V111.101C136.223 111.151 136.12 111.197 135.974 111.239C135.832 111.282 135.672 111.319 135.495 111.351C135.317 111.383 135.142 111.412 134.968 111.436C134.794 111.461 134.643 111.483 134.515 111.5C134.227 111.539 133.97 111.603 133.742 111.692C133.515 111.781 133.336 111.905 133.204 112.065C133.073 112.221 133.007 112.424 133.007 112.672C133.007 113.027 133.137 113.295 133.396 113.477C133.655 113.658 133.986 113.748 134.387 113.748ZM143.181 115.144C142.539 115.144 141.963 114.979 141.455 114.648C140.948 114.318 140.546 113.839 140.252 113.21C139.957 112.582 139.809 111.818 139.809 110.92C139.809 110.011 139.959 109.244 140.257 108.619C140.559 107.99 140.965 107.516 141.477 107.196C141.988 106.873 142.558 106.712 143.187 106.712C143.666 106.712 144.06 106.793 144.369 106.957C144.678 107.116 144.923 107.31 145.104 107.537C145.285 107.761 145.426 107.972 145.525 108.171H145.605V104.091H147.539V115H145.642V113.711H145.525C145.426 113.91 145.282 114.121 145.094 114.345C144.905 114.565 144.657 114.753 144.348 114.909C144.039 115.066 143.65 115.144 143.181 115.144ZM143.719 113.562C144.128 113.562 144.476 113.452 144.763 113.232C145.051 113.008 145.269 112.697 145.419 112.299C145.568 111.902 145.642 111.438 145.642 110.909C145.642 110.38 145.568 109.92 145.419 109.529C145.273 109.139 145.056 108.835 144.769 108.619C144.485 108.402 144.135 108.294 143.719 108.294C143.29 108.294 142.931 108.406 142.643 108.629C142.356 108.853 142.139 109.162 141.993 109.556C141.848 109.95 141.775 110.401 141.775 110.909C141.775 111.42 141.848 111.877 141.993 112.278C142.143 112.676 142.361 112.99 142.649 113.221C142.94 113.448 143.297 113.562 143.719 113.562ZM149.593 115V106.818H151.522V115H149.593ZM150.563 105.657C150.257 105.657 149.995 105.556 149.774 105.353C149.554 105.147 149.444 104.901 149.444 104.613C149.444 104.322 149.554 104.075 149.774 103.873C149.995 103.667 150.257 103.564 150.563 103.564C150.872 103.564 151.134 103.667 151.351 103.873C151.571 104.075 151.681 104.322 151.681 104.613C151.681 104.901 151.571 105.147 151.351 105.353C151.134 105.556 150.872 105.657 150.563 105.657ZM155.433 110.206V115H153.504V106.818H155.347V108.208H155.443C155.632 107.75 155.932 107.386 156.344 107.116C156.759 106.847 157.272 106.712 157.883 106.712C158.448 106.712 158.939 106.832 159.358 107.074C159.781 107.315 160.108 107.665 160.339 108.123C160.573 108.581 160.688 109.137 160.685 109.79V115H158.757V110.089C158.757 109.542 158.615 109.114 158.33 108.805C158.05 108.496 157.661 108.342 157.164 108.342C156.827 108.342 156.526 108.416 156.264 108.565C156.004 108.711 155.8 108.922 155.651 109.199C155.506 109.476 155.433 109.812 155.433 110.206ZM166.203 118.239C165.511 118.239 164.916 118.145 164.419 117.956C163.922 117.772 163.522 117.523 163.22 117.211C162.919 116.898 162.709 116.552 162.592 116.172L164.328 115.751C164.406 115.911 164.52 116.069 164.669 116.225C164.818 116.385 165.019 116.516 165.271 116.619C165.527 116.726 165.848 116.779 166.235 116.779C166.782 116.779 167.235 116.646 167.594 116.38C167.952 116.117 168.132 115.684 168.132 115.08V113.53H168.036C167.936 113.729 167.791 113.933 167.599 114.142C167.411 114.352 167.16 114.528 166.848 114.67C166.539 114.812 166.15 114.883 165.681 114.883C165.053 114.883 164.483 114.735 163.971 114.441C163.464 114.142 163.059 113.699 162.757 113.109C162.459 112.516 162.309 111.774 162.309 110.882C162.309 109.984 162.459 109.226 162.757 108.608C163.059 107.987 163.465 107.516 163.977 107.196C164.488 106.873 165.058 106.712 165.687 106.712C166.166 106.712 166.56 106.793 166.869 106.957C167.182 107.116 167.43 107.31 167.615 107.537C167.8 107.761 167.94 107.972 168.036 108.171H168.142V106.818H170.044V115.133C170.044 115.833 169.877 116.412 169.543 116.87C169.209 117.328 168.753 117.67 168.174 117.898C167.595 118.125 166.938 118.239 166.203 118.239ZM166.219 113.37C166.628 113.37 166.976 113.271 167.263 113.072C167.551 112.873 167.769 112.587 167.919 112.214C168.068 111.841 168.142 111.394 168.142 110.872C168.142 110.357 168.068 109.906 167.919 109.519C167.773 109.132 167.556 108.832 167.269 108.619C166.985 108.402 166.635 108.294 166.219 108.294C165.79 108.294 165.431 108.406 165.143 108.629C164.856 108.853 164.639 109.16 164.493 109.551C164.348 109.938 164.275 110.378 164.275 110.872C164.275 111.373 164.348 111.811 164.493 112.188C164.643 112.56 164.861 112.852 165.149 113.061C165.44 113.267 165.797 113.37 166.219 113.37ZM173.208 115.117C172.885 115.117 172.608 115.004 172.377 114.776C172.146 114.549 172.032 114.272 172.036 113.945C172.032 113.626 172.146 113.352 172.377 113.125C172.608 112.898 172.885 112.784 173.208 112.784C173.52 112.784 173.792 112.898 174.023 113.125C174.257 113.352 174.376 113.626 174.38 113.945C174.376 114.162 174.319 114.359 174.209 114.537C174.103 114.714 173.961 114.856 173.783 114.963C173.609 115.066 173.417 115.117 173.208 115.117ZM177.559 115.117C177.235 115.117 176.958 115.004 176.728 114.776C176.497 114.549 176.383 114.272 176.387 113.945C176.383 113.626 176.497 113.352 176.728 113.125C176.958 112.898 177.235 112.784 177.559 112.784C177.871 112.784 178.143 112.898 178.373 113.125C178.608 113.352 178.727 113.626 178.73 113.945C178.727 114.162 178.67 114.359 178.56 114.537C178.453 114.714 178.311 114.856 178.134 114.963C177.96 115.066 177.768 115.117 177.559 115.117ZM181.909 115.117C181.586 115.117 181.309 115.004 181.078 114.776C180.847 114.549 180.734 114.272 180.737 113.945C180.734 113.626 180.847 113.352 181.078 113.125C181.309 112.898 181.586 112.784 181.909 112.784C182.222 112.784 182.493 112.898 182.724 113.125C182.958 113.352 183.077 113.626 183.081 113.945C183.077 114.162 183.021 114.359 182.911 114.537C182.804 114.714 182.662 114.856 182.484 114.963C182.31 115.066 182.119 115.117 181.909 115.117Z"
            fill="#91DDD8"
          />
          <path className="mountain--svg"
            d="M96 154H14L101 45L116 65L151 19L164 40L184 13L263 154H96Z"
            stroke="#91DDD8"
            strokeWidth="3"
          />
          <g filter="url(#filter0_f_1_5)">
            <path className="blur--svg"
              d="M96 154H14L101 45L116 65L151 19L164 40L184 13L263 154H96Z"
              stroke="#91DDD8"
              strokeWidth="3"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_1_5"
              x="0.883545"
              y="0.243637"
              width="274.676"
              height="165.256"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="5"
                result="effect1_foregroundBlur_1_5"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}
