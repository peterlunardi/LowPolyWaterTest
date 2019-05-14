#version 330 core
out vec4 FragColor;

const float fresnelReflective = 0.4;
const vec3 waterColour = vec3(0.301, 0.731, 0.877);

in vec3 Normal;
in vec3 Position;

in vec3 pass_toCameraVector;

in VS_OUT {
		vec3 FragPos;
		vec3 Normal;
		vec2 TexCoords;
	} fs_in;

uniform vec3 cameraPos;
uniform vec3 lightPos;
uniform samplerCube skybox;

float calculateFresnel(){
	vec3 viewVector = normalize(pass_toCameraVector);
	vec3 normal = normalize(Normal);
	float refractiveFactor = dot(viewVector, normal);
	refractiveFactor = pow(refractiveFactor, fresnelReflective);
	return clamp(refractiveFactor, 0.0, 1.0);
}

void main()
{

	vec4 blue = vec4(0.0, 0.1, 0.2, 1.0);

	vec3 refractColor;
	float ratio = 1.00 / 1.01;
	vec3 a = normalize(Position - cameraPos);
	vec3 b = refract(a, normalize(Normal), ratio);
	refractColor = texture(skybox, b).rgb;

	vec3 reflectColor;
	vec3 I = normalize(Position - cameraPos);
    vec3 R = reflect(I, normalize(Normal));
	reflectColor = texture(skybox, R).rgb;

	

	vec3 finalColour = mix(reflectColor, refractColor, 0);
	finalColour = mix(finalColour, waterColour, 0);

	//ambient
	vec3 ambient = 0.4 * finalColour;

	//diffuse
	vec3 lightDir = normalize(lightPos - fs_in.FragPos);
    vec3 normal = normalize(fs_in.Normal);
    float diff = max(dot(lightDir, normal), 0.0);
    vec3 diffuse = diff * finalColour;

	//specular
	vec3 viewDir = normalize(cameraPos - fs_in.FragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = 0.0;
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    spec = pow(max(dot(normal, halfwayDir), 0.0), 1.0);
    vec3 specular = vec3(0.3) * spec; // assuming bright white light color
	
    FragColor =  vec4(mix(ambient + diffuse + specular, finalColour, 1.0), 1.0);
} 

