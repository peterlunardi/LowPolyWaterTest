#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoords;
layout (location = 2) in vec3 aNormal;

const float PI = 3.1415926535897932384626433832795;

//yer auld da loves a builders brew

const float waveLength = 20.0;
const float waveAmplitude = 2.2;
const float height = 0;


out vec3 Normal;
out vec3 Position;
out vec3 pass_toCameraVector;


uniform float waveTime;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

uniform vec3 cameraPos;

out VS_OUT {
		vec3 FragPos;
		vec3 Normal;
		vec2 TexCoords;
	} vs_out;


float generateOffset(float x, float z)
{
	float radiansX = (x / waveLength + waveTime) * 2.0 * PI;
	float radiansZ = (z / waveLength + waveTime) * 2.0 * PI;
	return waveAmplitude * 0.5 * (sin(radiansZ) + cos(radiansX));
}

vec3 applyDistortion(vec3 vertex){
	float xDistortion = generateOffset(vertex.x, vertex.z);
	float yDistortion = generateOffset(vertex.x, vertex.z);
	float zDistortion = generateOffset(vertex.x, vertex.z);
	return vertex + vec3(0, yDistortion, 0);
}

void main()
{
	
    vs_out.Normal = aNormal;
    vs_out.TexCoords = aTexCoords;

	vec3 currentVertex = vec3(aPos.x, height, aPos.z);

	currentVertex = applyDistortion(currentVertex);

	Normal = mat3(transpose(inverse(model))) * aNormal;
    Position = vec3(model * vec4(aPos, 1.0));
    gl_Position = projection * view * model * vec4(currentVertex, 1.0);

	vs_out.FragPos = currentVertex;

	pass_toCameraVector = normalize(cameraPos - currentVertex);



}
